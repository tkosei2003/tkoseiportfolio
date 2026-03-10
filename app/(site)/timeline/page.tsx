'use client';

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { setAboutEntryDirection } from '@lib/aboutTransition';
import { timelineEvents } from '@data/timelineEvents';

const WHEEL_STEP_THRESHOLD = 86;
const PAGE_NAV_THRESHOLD = 42;
const SWIPE_STEP_THRESHOLD = 72;
const STEP_LOCK_MS = 420;
const WHEEL_RESET_MS = 170;
const ARC_STEP_DEG = 24;
const MAX_VISIBLE_DISTANCE = 3;
const MOBILE_MAX_VISIBLE_DISTANCE = 2;
const MIN_ITEM_GAP_PX = 84;
const INITIAL_ACTIVE_INDEX = Math.max(timelineEvents.length - 1, 0);

export default function TimelinePage() {
  const router = useRouter();
  const gradientIdSeed = useId().replace(/:/g, '');
  const arcBaseGradientId = `${gradientIdSeed}-arc-base`;
  const arcGlowOuterGradientId = `${gradientIdSeed}-arc-glow-outer`;
  const arcGlowInnerGradientId = `${gradientIdSeed}-arc-glow-inner`;
  const pageRef = useRef<HTMLDivElement>(null);
  const revolverRef = useRef<HTMLDivElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const touchInRevolverRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const lastWheelAtRef = useRef(0);
  const unlockTimerRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(INITIAL_ACTIVE_INDEX);
  const activeIndexRef = useRef(INITIAL_ACTIVE_INDEX);
  const [isMobile, setIsMobile] = useState(false);
  const [isRevolverTargeted, setIsRevolverTargeted] = useState(false);

  useLayoutEffect(() => {
    if (!pageRef.current) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        pageRef.current,
        { autoAlpha: 0, y: 28, filter: 'blur(6px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
        },
      );

      if (!revolverRef.current) return;

      const revolverRect = revolverRef.current.getBoundingClientRect();
      const centerX = revolverRect.left + revolverRect.width / 2;
      const centerY = revolverRect.top + revolverRect.height / 2;
      const itemElements = Array.from(
        revolverRef.current.querySelectorAll<HTMLElement>('[data-revolver-item="true"]'),
      );

      itemElements.forEach((itemEl, index) => {
        const rect = itemEl.getBoundingClientRect();
        const itemX = rect.left + rect.width / 2;
        const itemY = rect.top + rect.height / 2;
        const vectorX = itemX - centerX;
        const vectorY = itemY - centerY;

        // Prevent CSS transform transition from animating the initial offset set.
        itemEl.style.transitionProperty = 'opacity, filter';
        itemEl.style.setProperty('--entry-x', `${vectorX * 0.82}px`);
        itemEl.style.setProperty('--entry-y', `${vectorY * 0.82}px`);

        gsap.to(itemEl, {
          '--entry-x': '0px',
          '--entry-y': '0px',
          duration: 0.9,
          delay: index * 0.035,
          ease: 'power3.out',
          overwrite: 'auto',
          onComplete: () => {
            itemEl.style.removeProperty('transition-property');
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    router.prefetch('/about');
  }, [router]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (!detailPanelRef.current) return;

    gsap.fromTo(
      detailPanelRef.current,
      { autoAlpha: 0, y: 12, filter: 'blur(6px)' },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      },
    );
  }, [activeIndex]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const clearUnlockTimer = () => {
      if (unlockTimerRef.current == null) return;
      window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    };

    const lockInput = (duration = STEP_LOCK_MS) => {
      lockRef.current = true;
      clearUnlockTimer();
      unlockTimerRef.current = window.setTimeout(() => {
        lockRef.current = false;
        unlockTimerRef.current = null;
      }, duration);
    };

    const navigateToAbout = () => {
      if (lockRef.current || !pageRef.current) return;
      lockRef.current = true;
      clearUnlockTimer();

      gsap.to(pageRef.current, {
        autoAlpha: 0,
        y: 56,
        filter: 'blur(6px)',
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          setAboutEntryDirection('from-top');
          router.replace('/about');
        },
        onInterrupt: () => {
          lockRef.current = false;
        },
      });
    };

    const stepNext = () => {
      if (lockRef.current) return;
      if (activeIndexRef.current >= timelineEvents.length - 1) {
        lockInput(220);
        return;
      }

      const nextIndex = Math.min(activeIndexRef.current + 1, timelineEvents.length - 1);
      activeIndexRef.current = nextIndex;
      lockInput();
      setActiveIndex(nextIndex);
    };

    const stepPrev = () => {
      if (lockRef.current) return;
      if (activeIndexRef.current <= 0) {
        lockInput(220);
        return;
      }

      const prevIndex = Math.max(activeIndexRef.current - 1, 0);
      activeIndexRef.current = prevIndex;
      lockInput();
      setActiveIndex(prevIndex);
    };

    const handleWheel = (e: WheelEvent) => {
      const targetNode = e.target instanceof Node ? e.target : null;
      const isRevolverEvent = !!(targetNode && revolverRef.current?.contains(targetNode));

      if (isRevolverEvent) {
        e.preventDefault();
        if (lockRef.current) return;

        const now = performance.now();
        if (now - lastWheelAtRef.current > WHEEL_RESET_MS) {
          wheelAccumRef.current = 0;
        }
        lastWheelAtRef.current = now;
        wheelAccumRef.current += e.deltaY;

        if (wheelAccumRef.current >= WHEEL_STEP_THRESHOLD) {
          wheelAccumRef.current = 0;
          stepNext();
        } else if (wheelAccumRef.current <= -WHEEL_STEP_THRESHOLD) {
          wheelAccumRef.current = 0;
          stepPrev();
        }
        return;
      }

      wheelAccumRef.current = 0;
      if (e.deltaY <= -PAGE_NAV_THRESHOLD) {
        navigateToAbout();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
      const targetNode = e.target instanceof Node ? e.target : null;
      touchInRevolverRef.current = !!(targetNode && revolverRef.current?.contains(targetNode));
      if (touchInRevolverRef.current) {
        setIsRevolverTargeted(true);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const startY = touchStartYRef.current;
      const endY = e.changedTouches[0]?.clientY;
      touchStartYRef.current = null;

      if (startY == null || endY == null) return;

      const swipeDelta = startY - endY;

      if (touchInRevolverRef.current) {
        if (swipeDelta >= SWIPE_STEP_THRESHOLD) {
          stepNext();
        } else if (swipeDelta <= -SWIPE_STEP_THRESHOLD) {
          stepPrev();
        }
        touchInRevolverRef.current = false;
        setIsRevolverTargeted(false);
        return;
      }

      if (swipeDelta <= -SWIPE_STEP_THRESHOLD) {
        navigateToAbout();
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigateToAbout();
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        stepNext();
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (activeIndexRef.current <= 0) {
          navigateToAbout();
        } else {
          stepPrev();
        }
      }
    };

    const resetTouch = () => {
      touchStartYRef.current = null;
      touchInRevolverRef.current = false;
      setIsRevolverTargeted(false);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', resetTouch, { passive: true });
    window.addEventListener('keydown', handleKeydown);

    return () => {
      clearUnlockTimer();
      setIsRevolverTargeted(false);
      lockRef.current = false;
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', resetTouch);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [router]);

  const activeEvent = timelineEvents[activeIndex];
  const activeProgressLabel = `${activeIndex + 1}/${timelineEvents.length}`;
  const arcCenterX = isMobile ? -18 : -30;
  const activeCardWidth = isMobile ? 'min(72vw, 286px)' : 'min(74vw, 380px)';
  const inactiveCardWidth = isMobile ? 'min(42vw, 210px)' : 'min(50vw, 282px)';

  const positionedEvents = useMemo(() => {
    const radius = isMobile ? 118 : 280;
    const centerX = isMobile ? 22 : 24;
    const maxVisibleDistance = isMobile ? MOBILE_MAX_VISIBLE_DISTANCE : MAX_VISIBLE_DISTANCE;
    const minStepRad = Math.asin(Math.min(0.94, MIN_ITEM_GAP_PX / radius));
    const adaptiveStepDeg = Math.max(ARC_STEP_DEG, (minStepRad * 180) / Math.PI);

    return timelineEvents
      .map((event, index) => {
        const distance = index - activeIndex;
        const absDistance = Math.abs(distance);
        const hidden = absDistance > maxVisibleDistance;
        const angleDeg = distance * adaptiveStepDeg;
        const angleRad = (angleDeg * Math.PI) / 180;

        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;

        const opacity = distance === 0 ? 1 : Math.max(0.12, 0.86 - absDistance * 0.24);
        const scale = distance === 0 ? 1 : Math.max(0.78, 1 - absDistance * 0.07);

        return {
          event,
          index,
          hidden,
          x,
          y,
          opacity,
          scale,
          centerX,
        };
      })
      .filter((item) => !item.hidden);
  }, [activeIndex, isMobile]);

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
    >
      <section className="relative mx-auto flex min-h-screen w-full max-w-[1100px] flex-col gap-6 px-4 pt-[calc(4.5rem+env(safe-area-inset-top))] pb-8 sm:px-6 sm:pb-12 lg:block lg:px-10 lg:py-24">
        <div className="z-10 min-h-[300px] max-w-none pr-1 lg:absolute lg:top-1/2 lg:left-10 lg:min-h-0 lg:max-w-md lg:-translate-y-1/2">
          <p className="text-xs tracking-[0.34em] text-white/52 uppercase">History & News</p>
          <div className="mt-3 flex items-end justify-between gap-3 sm:mt-4">
            <h1 className="text-4xl leading-none tracking-tight sm:text-6xl lg:text-7xl">
              Timeline
            </h1>
            <div className="flex items-end gap-2 text-[11px] text-white/45 sm:hidden">
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() => {
                  activeIndexRef.current = 0;
                  setActiveIndex(0);
                }}
                className="pointer-events-auto px-1.5 py-0.5 tracking-[0.08em] transition hover:text-white disabled:pointer-events-none disabled:opacity-35"
              >
                Beginning
              </button>
              <span className="h-4.5 w-px bg-white/25" />
              <button
                type="button"
                disabled={activeIndex === timelineEvents.length - 1}
                onClick={() => {
                  activeIndexRef.current = timelineEvents.length - 1;
                  setActiveIndex(timelineEvents.length - 1);
                }}
                className="pointer-events-auto px-1.5 py-0.5 tracking-[0.08em] transition hover:text-white disabled:pointer-events-none disabled:opacity-35"
              >
                Latest
              </button>
            </div>
          </div>
          <div ref={detailPanelRef} className="mt-9 text-white">
            <div className="flex items-center gap-3">
              <p className="text-xs tracking-[0.16em] text-white/45 uppercase">
                {activeEvent.date}
              </p>
            </div>
            <p className="mt-2 text-lg leading-tight font-semibold sm:text-xl">
              {activeEvent.title}
            </p>
            <div className="mt-2 max-h-[170px] min-h-[130px] overflow-y-auto pr-1 sm:max-h-[186px] sm:min-h-[142px] lg:max-h-[210px] lg:min-h-[160px]">
              <p className="text-sm leading-relaxed text-white/65 sm:text-[15px]">
                {activeEvent.detail}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/58 sm:text-[15px]">
                {activeEvent.summary}
              </p>
              {activeEvent.links?.length ? (
                <div className="mt-4 mb-2 flex flex-wrap gap-2">
                  {activeEvent.links.map((link) => (
                    <a
                      key={`${link.href}-${link.label}`}
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noreferrer noopener' : undefined}
                      className="min-h-5 rounded-full border border-white/28 px-3 py-1.5 text-xs tracking-[0.12em] text-white/78 transition hover:border-white/60 hover:text-white"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <span className="rounded border border-white/25 px-1.5 py-0.5 text-[11px] tracking-[0.14em] text-white/45">
            {activeProgressLabel}
          </span>
        </div>

        <div
          ref={revolverRef}
          className="relative isolate z-20 mx-auto -mt-20 h-[420px] w-[calc(100%-1rem)] max-w-[640px] touch-none sm:z-auto sm:mt-0 sm:h-[520px] sm:w-[calc(100%-2rem)] lg:absolute lg:top-1/2 lg:right-4 lg:h-[560px] lg:w-[min(64vw,820px)] lg:-translate-y-1/2"
          onPointerEnter={() => setIsRevolverTargeted(true)}
          onPointerLeave={() => setIsRevolverTargeted(false)}
          onFocusCapture={() => setIsRevolverTargeted(true)}
          onBlurCapture={() => setIsRevolverTargeted(false)}
        >
          <div className="pointer-events-none absolute inset-0">
            <svg
              aria-hidden="true"
              className="absolute top-1/2 aspect-square h-[86%] -translate-y-1/2 overflow-visible"
              style={{ left: `${arcCenterX}%` }}
              viewBox="0 0 100 100"
              fill="none"
            >
              <defs>
                <linearGradient
                  id={arcBaseGradientId}
                  x1="50"
                  y1="6"
                  x2="50"
                  y2="94"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="white" stopOpacity={isRevolverTargeted ? 0 : 0.0} />
                  <stop
                    offset="16%"
                    stopColor="white"
                    stopOpacity={isRevolverTargeted ? 0.6 : 0.3}
                  />
                  <stop offset="50%" stopColor="white" stopOpacity={isRevolverTargeted ? 1 : 1} />
                  <stop
                    offset="84%"
                    stopColor="white"
                    stopOpacity={isRevolverTargeted ? 0.6 : 0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="white"
                    stopOpacity={isRevolverTargeted ? 0 : 0.0}
                  />
                </linearGradient>
                <linearGradient
                  id={arcGlowOuterGradientId}
                  x1="50"
                  y1="6"
                  x2="50"
                  y2="94"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="18%" stopColor="white" stopOpacity="0.42" />
                  <stop offset="50%" stopColor="white" stopOpacity="0.92" />
                  <stop offset="82%" stopColor="white" stopOpacity="0.42" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id={arcGlowInnerGradientId}
                  x1="50"
                  y1="6"
                  x2="50"
                  y2="94"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="18%" stopColor="white" stopOpacity="0.26" />
                  <stop offset="50%" stopColor="white" stopOpacity="0.7" />
                  <stop offset="82%" stopColor="white" stopOpacity="0.26" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g
                className={`transition-opacity duration-200 ${
                  isRevolverTargeted ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <path
                  d="M50 6 A44 44 0 0 1 50 94"
                  stroke={`url(#${arcGlowOuterGradientId})`}
                  strokeWidth="5.8"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ filter: 'blur(2.4px)' }}
                />
                <path
                  d="M50 6 A44 44 0 0 1 50 94"
                  stroke={`url(#${arcGlowInnerGradientId})`}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ filter: 'blur(1px)' }}
                />
              </g>
              <path
                d="M50 6 A44 44 0 0 1 50 94"
                stroke={`url(#${arcBaseGradientId})`}
                strokeWidth={isRevolverTargeted ? '1.5' : '1.24'}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="transition-[stroke-width] duration-200"
              />
            </svg>
          </div>

          {positionedEvents.map((item) => {
            const isActive = item.index === activeIndex;

            return (
              <button
                key={`${item.event.date}-${item.index}`}
                type="button"
                data-revolver-item="true"
                className="absolute top-1/2 text-left transition-[transform,opacity,filter] duration-500 ease-out will-change-transform [--entry-x:0px] [--entry-y:0px]"
                style={{
                  left: `${item.centerX}%`,
                  transform: `translate(-50%, -50%) translate3d(calc(${item.x}px + var(--entry-x)), calc(${item.y}px + var(--entry-y)), 0) scale(${item.scale})`,
                  opacity: item.opacity,
                  filter: isActive ? 'blur(0px)' : 'blur(0.3px)',
                  pointerEvents: isActive ? 'none' : 'auto',
                }}
                onClick={() => {
                  if (lockRef.current || isActive) return;
                  activeIndexRef.current = item.index;
                  setActiveIndex(item.index);
                }}
              >
                {isActive ? (
                  <div
                    className="max-w-full rounded-xl border border-white/82 bg-black px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.22),0_0_24px_rgba(255,255,255,0.36)] sm:px-5 sm:py-4"
                    style={{ width: activeCardWidth }}
                  >
                    <p className="text-[16px] leading-none font-bold text-white/55 sm:text-[18px]">
                      {item.event.date}
                    </p>
                    <p className="mt-1 text-[16px] leading-tight font-semibold break-words text-white sm:text-[20px]">
                      {item.event.title}
                    </p>
                  </div>
                ) : (
                  <div style={{ width: inactiveCardWidth }}>
                    <p className="text-[14px] leading-none font-semibold text-white/30 sm:text-[18px]">
                      {item.event.date}
                    </p>
                    <p className="mt-1 text-[15px] leading-tight font-medium text-white/58 sm:text-[20px]">
                      {item.event.title}
                    </p>
                  </div>
                )}
              </button>
            );
          })}

          <div className="absolute bottom-0 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 text-white/35 sm:-bottom-4 sm:flex sm:gap-4 lg:-bottom-5">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => {
                activeIndexRef.current = 0;
                setActiveIndex(0);
              }}
              className="pointer-events-auto text-sm transition hover:text-white disabled:pointer-events-none disabled:opacity-35 sm:text-xl"
            >
              <p>Beginning</p>
            </button>

            <span className="h-4 w-px bg-white/22 sm:h-5" />

            <button
              type="button"
              disabled={activeIndex === timelineEvents.length - 1}
              onClick={() => {
                activeIndexRef.current = timelineEvents.length - 1;
                setActiveIndex(timelineEvents.length - 1);
              }}
              className="pointer-events-auto text-sm transition hover:text-white disabled:pointer-events-none disabled:opacity-35 sm:text-xl"
            >
              <p>Latest</p>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
