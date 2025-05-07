window.addEventListener("load", function(){
    const loader = document.querySelector(".load-body");
    loader.classList.add('loader-hidden');
    // document.body.style.overflow = 'auto';
});
// to remove loader after loading
// loader.addEventListener("load", function(){
//     document.body.removeChild(loader); 
// });


// slider
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.slider-img').forEach(element => {
        element.addEventListener('click', function() {
            const wasActive = this.classList.contains('active');
            
            // Remove active class from all images
            document.querySelectorAll('.slider-img').forEach(img => {
                img.classList.remove('active');
            });
            
            if (!wasActive) {
                this.classList.add('active');
                
                // Center the active slide
                const container = document.querySelector('.slider-images');
                const rect = this.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                
                const activeLeft = rect.left - containerRect.left;
                container.scrollLeft = activeLeft - (container.offsetWidth / 2) + (this.offsetWidth / 2);
            }
        });
    });
});

// Add Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
  
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  });
  
  // Update slider initialization in kims-records.js
  document.querySelectorAll('.slider-img').forEach(element => {
    element.addEventListener('click', function() {
      // ... existing code ...
      if (!wasActive) {
        this.classList.add('active');
        this.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    });
  });
// Music Player Functionality
  // Updated JavaScript
  const musicPlayer = (() => {
    const audio = new Audio();
    const playlist = [
        { 
            title: "ise(Amen)", 
            artist: 'Kelly Imasuen',
            image: "images/ise.webp",
            file: "music/ise.mp3", 
            duration: "3:45",
            
        },
        { 
            title: 'Oyunua', 
            artist: 'Kelly Imasuen FT Bro. Destiny',
            image: './images/oyunua.jpg',
            file: './music/oyunua.mp3',
            duration: '4:20'
        },
        { 
            title: 'Ofunmwegbe', 
            artist: 'Kelly Imasuen',
            image: './images/IMG-20250409-WA0022.jpg',
            file: './music/ofunmwengbe.mp3',
            duration: '3:47'
        },
        { 
            title: "Osawese", 
            file: "music/osawese.mp3", 
            duration: "4:18",
            image: "images/osawese.jpg"
        },
        // { 
        //     title: "ise(Amen)", 
        //     file: "music/ise.mp3", 
        //     duration: "3:45",
        //     image: "images/IMG-20250409-WA0016.jpg"
        // },
        // Add other tracks with images...
    ];

    let currentTrack = 0;
    let isShuffled = false;
    let isRepeating = false;
    let isPlaying = false;

    // Elements
    const elements = {
        playBtns: document.querySelectorAll('.play, .play-al'),
        progressBars: document.querySelectorAll('.progress, .progress-al'),
        currentTimes: document.querySelectorAll('.current-time, .current-time-al'),
        totalTimes: document.querySelectorAll('.total-time, .total-time-al'),
        nextBtns: document.querySelectorAll('.next, .next-al'),
        prevBtns: document.querySelectorAll('.prev, .prev-al'),
        shuffleBtns: document.querySelectorAll('.fa-shuffle'),
        repeatBtns: document.querySelectorAll('.fa-repeat'),
        trackTitles: document.querySelectorAll('.track-info h6'),
        trackList: document.querySelectorAll('.tracks li p'),
        stickyPreview: document.getElementById('sticky-preview'),
        stickyImage: document.querySelector('.sticky-track-image')
    };

    // Format time helper
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    // Update display
    const updateDisplay = () => {
        elements.trackTitles.forEach(el => {
            el.textContent = playlist[currentTrack].title;
        });
        elements.stickyImage.src = playlist[currentTrack].image;
    };

    // Update progress
    const updateProgress = () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        const currentTime = formatTime(audio.currentTime);
        const totalTime = formatTime(audio.duration);

        // Update progress visualization
        elements.stickyPreview.style.setProperty('--progress', `${progress}%`);
        elements.progressBars.forEach(bar => bar.style.width = `${progress}%`);
        elements.currentTimes.forEach(el => el.textContent = currentTime);
        elements.totalTimes.forEach(el => el.textContent = totalTime);
    };

    // Play/pause toggle
    const togglePlayPause = () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            audio.play();
            elements.stickyPreview.style.display = 'block';
            setTimeout(() => elements.stickyPreview.classList.add('active'), 10);
        } else {
            audio.pause();
            elements.stickyPreview.classList.remove('active');
        }
        elements.playBtns.forEach(btn => {
            btn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        });
    };

    // Load track
    const loadTrack = (index) => {
        currentTrack = index;
        audio.src = playlist[index].file;
        updateDisplay();
        if (isPlaying) audio.play();
    };

    // Handle track change
    const handleTrackChange = (direction) => {
        let newIndex = currentTrack + direction;
        if (isShuffled) {
            newIndex = Math.floor(Math.random() * playlist.length);
        } else {
            newIndex = (newIndex + playlist.length) % playlist.length;
        }
        loadTrack(newIndex);
    };

    // Initialize event listeners
    const initEventListeners = () => {
        // Play/Pause
        elements.playBtns.forEach(btn => btn.addEventListener('click', togglePlayPause));

        // Navigation
        elements.nextBtns.forEach(btn => btn.addEventListener('click', () => handleTrackChange(1)));
        elements.prevBtns.forEach(btn => btn.addEventListener('click', () => handleTrackChange(-1)));

        // Progress bars
        document.querySelectorAll('.progress-bar, .progress-bar-al').forEach(bar => {
            bar.addEventListener('click', (e) => {
                const rect = bar.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                audio.currentTime = pos * audio.duration;
            });
        });

        // Track list
        elements.trackList.forEach((track, index) => {
            track.addEventListener('click', () => {
                loadTrack(index);
                if (!isPlaying) togglePlayPause();
            });
        });

        // Shuffle/Repeat
        elements.shuffleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                isShuffled = !isShuffled;
                elements.shuffleBtns.forEach(b => b.classList.toggle('active', isShuffled));
            });
        });

        elements.repeatBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                isRepeating = !isRepeating;
                elements.repeatBtns.forEach(b => b.classList.toggle('active', isRepeating));
            });
        });

        // Sticky preview click
        elements.stickyPreview.addEventListener('click', () => {
            document.querySelector('#music-player').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });

        // Audio events
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', () => {
            if (isRepeating) {
                audio.currentTime = 0;
                audio.play();
            } else {
                handleTrackChange(1);
            }
        });
    };

    // Initialize
    const init = () => {
        initEventListeners();
        loadTrack(0);
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', musicPlayer.init);

// Add this script
// Modal functionality
const modal = document.querySelector('.video-modal');
const modalTrigger = document.querySelector('.modal-trigger');
const modalClose = document.querySelector('.modal-close');

function openModal() {
  modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    // Pause video
    const iframe = document.querySelector('.modal-video-container iframe');
    iframe.src = iframe.src; // Reset src to stop video
  }
// Event listeners
modalTrigger.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if(e.target.classList.contains('modal-backdrop')) closeModal();
});

// Optional: Close on ESC key
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeModal();
});




// tab

class TabSystem {
    constructor() {
        this.tabSection = document.querySelector('.tab-section');
        this.tabNav = document.querySelector('.tab-nav');
        this.tabs = Array.from(document.querySelectorAll('.tab-btn'));
        this.contents = document.querySelectorAll('.tab-content');
        this.indicator = document.querySelector('.tab-indicator');
        this.sectionTop = 0;
        this.sectionBottom = 0;

        this.init();
        this.calculateOffsets();
        this.addScrollListener();
    }

    init() {
        const initialTab = this.tabs.find(t => t.classList.contains('active'));
        this.updateIndicator(initialTab);
        this.tabNav.addEventListener('click', (e) => this.handleTabClick(e));
        window.addEventListener('resize', () => this.handleResize());
    }

    calculateOffsets() {
        const rect = this.tabSection.getBoundingClientRect();
        this.sectionTop = rect.top + window.scrollY;
        this.sectionBottom = this.sectionTop + this.tabSection.offsetHeight;
    }

    addScrollListener() {
        let ticking = false;
        
        const updateStickyState = () => {
            const scrollY = window.scrollY;
            const navHeight = this.tabNav.offsetHeight;
            
            const shouldBeSticky = scrollY > this.sectionTop - 100 && 
                                scrollY < this.sectionBottom - navHeight - 100;

            if (shouldBeSticky && !this.tabNav.classList.contains('sticky')) {
                this.tabNav.classList.add('sticky');
            } else if (!shouldBeSticky && this.tabNav.classList.contains('sticky')) {
                this.tabNav.classList.remove('sticky');
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateStickyState);
                ticking = true;
            }
        });

        window.addEventListener('resize', () => {
            this.calculateOffsets();
            updateStickyState();
        });
    }

    handleTabClick(e) {
        const tab = e.target.closest('.tab-btn');
        if (!tab) return;

        this.tabs.forEach(t => t.classList.remove('active'));
        this.contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.dataset.target;
        document.getElementById(targetId).classList.add('active');
        this.updateIndicator(tab);
    }

    updateIndicator(tab) {
        const containerLeft = this.tabNav.getBoundingClientRect().left;
        const tabLeft = tab.getBoundingClientRect().left;
        const relativeLeft = tabLeft - containerLeft;

        this.indicator.style.cssText = `
            width: ${tab.offsetWidth}px;
            left: ${relativeLeft}px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
    }

    handleResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            const activeTab = this.tabs.find(t => t.classList.contains('active'));
            this.updateIndicator(activeTab);
            this.calculateOffsets();
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TabSystem();
});


// // Form Validation
// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.querySelector('.needs-validation');
//   const successModal = document.querySelector('.validation-success');

//   form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     form.classList.add('was-validated');

//     if (form.checkValidity()) {
//       // If valid, show success modal
//       successModal.classList.add('active');
      
//       // Reset form after 3 seconds
//       setTimeout(() => {
//         form.classList.remove('was-validated');
//         form.reset();
//         successModal.classList.remove('active');
//       }, 3000);
//     }
//   }, false);

//   // Real-time validation
//   form.querySelectorAll('.form-control').forEach(input => {
//     input.addEventListener('input', () => {
//       if (input.validity.valid) {
//         input.classList.remove('invalid');
//         input.nextElementSibling.style.display = 'none';
//       } else {
//         input.classList.add('invalid');
//         input.nextElementSibling.style.display = 'block';
//       }
//     });
//   });
// });
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.needs-validation');
  const successModal = document.querySelector('.validation-success');
  const formAction = 'https://formspree.io/f/xqaqqrqv'; // Replace with your Formspree ID

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    form.classList.add('was-validated');

    if (form.checkValidity()) {
      try {
        // Add loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';

        // Send to Formspree
        const response = await fetch(formAction, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Show success message
          successModal.classList.add('active');
          form.reset();
          form.classList.remove('was-validated');
          
          // Hide success modal after 3 seconds
          setTimeout(() => {
            successModal.classList.remove('active');
          }, 3000);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Submission failed');
        }
      } catch (error) {
        // Show error message
        const errorElement = document.createElement('div');
        errorElement.className = 'alert alert-danger mt-3';
        errorElement.textContent = `Error: ${error.message}`;
        form.parentNode.insertBefore(errorElement, form.nextSibling);
        
        // Remove error after 5 seconds
        setTimeout(() => {
          errorElement.remove();
        }, 5000);
      } finally {
        // Reset button state
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit';
      }
    }
  });

  // Real-time validation (keep existing)
  form.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
      if (input.validity.valid) {
        input.classList.remove('invalid');
        input.nextElementSibling.style.display = 'none';
      } else {
        input.classList.add('invalid');
        input.nextElementSibling.style.display = 'block';
      }
    });
  });
});


// testimonials
class TestimonialSlider {
    constructor() {
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.init();
    }

    init() {
        document.querySelector('.prev-slide').addEventListener('click', () => this.slide(-1));
        document.querySelector('.next-slide').addEventListener('click', () => this.slide(1));
        this.updateIndicators();
        this.showSlide(this.currentIndex);
    }

    slide(direction) {
        this.currentIndex = (this.currentIndex + direction + this.totalSlides) % this.totalSlides;
        this.showSlide(this.currentIndex);
        this.updateIndicators();
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            slide.style.transform = i === index ? 'translateX(0)' : 
                                  i < index ? 'translateX(-100%)' : 'translateX(100%)';
        });
    }

    updateIndicators() {
        const indicator = document.querySelector('.slide-indicators .active');
        indicator.textContent = `${(this.currentIndex + 1).toString().padStart(2, '0')}`;
        document.querySelector('.total-slides').textContent = `/ ${this.totalSlides.toString().padStart(2, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => new TestimonialSlider());


// Add after DOMContentLoaded event
function handleViewportChanges() {
    // Footer visibility fix
    const footer = document.querySelector('.footer-section');
    const contentHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;
    
    if (contentHeight < viewportHeight) {
      footer.style.position = 'fixed';
      footer.style.bottom = '0';
      footer.style.width = '100%';
    } else {
      footer.style.position = 'relative';
    }
  }
  
  // Run on load and resize
  window.addEventListener('load', handleViewportChanges);
  window.addEventListener('resize', handleViewportChanges);
  
  // Mobile menu toggle fix
  document.querySelector('.button-toggle').addEventListener('click', function() {
    const navbar = document.getElementById('navbar');
    document.body.style.overflow = navbar.classList.contains('show') ? 'auto' : 'hidden';
  })
// footer
// Add intersection observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.reveal-on-viewport').forEach(el => observer.observe(el));

//   small swiper
// Add this Slider Logic
class Swiper {
    constructor() {
      this.container = document.querySelector('.swiper-container');
      this.track = document.querySelector('.swiper-track');
      this.slides = document.querySelectorAll('.swiper-slide');
      this.prevBtn = document.querySelector('.swiper-prev');
      this.nextBtn = document.querySelector('.swiper-next');
      this.dots = document.querySelectorAll('.swiper-pagination-dot');
      this.currentIndex = 0;
      
      this.init();
    }
  
    init() {
      // Navigation
      this.prevBtn.addEventListener('click', () => this.slideTo(this.currentIndex - 1));
      this.nextBtn.addEventListener('click', () => this.slideTo(this.currentIndex + 1));
      
      // Pagination
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.slideTo(index));
      });
  
      // Touch Handling
      let touchStartX = 0;
      let touchEndX = 0;
  
      this.container.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
  
      this.container.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) this.next();
        if (touchStartX - touchEndX < -50) this.prev();
      }, { passive: true });
  
      // Keyboard
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });
  
      // Init
      this.update();
    }
  
    slideTo(index) {
      this.currentIndex = Math.max(0, Math.min(index, this.slides.length - 1));
      this.update();
      this.scrollToCurrent();
    }
  
    scrollToCurrent() {
      const slide = this.slides[this.currentIndex];
      const containerWidth = this.container.offsetWidth;
      slide.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  
    update() {
      this.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentIndex);
      });
    }
  
    next() {
      this.slideTo(this.currentIndex + 1);
    }
  
    prev() {
      this.slideTo(this.currentIndex - 1);
    }
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => new Swiper());