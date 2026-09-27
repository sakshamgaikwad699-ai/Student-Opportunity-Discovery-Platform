/**
 * Interactive AJAX Bookmark Handler
 */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.bookmark-toggle-btn');
    if (!btn) return;

    e.preventDefault();
    const oppId = btn.dataset.opportunityId;
    if (!oppId) return;

    try {
      btn.disabled = true;
      const res = await fetch(`/opportunities/${oppId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      const data = await res.json();
      if (data.success) {
        const icon = btn.querySelector('.bookmark-icon');
        const text = btn.querySelector('.bookmark-text');
        
        if (data.bookmarked) {
          btn.classList.add('bg-indigo-600', 'text-white');
          btn.classList.remove('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
          if (icon) {
            icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" fill="currentColor"/>`;
          }
          if (text) text.textContent = 'Saved';
        } else {
          btn.classList.remove('bg-indigo-600', 'text-white');
          btn.classList.add('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
          if (icon) {
            icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" fill="none"/>`;
          }
          if (text) text.textContent = 'Bookmark';
        }

        // Update badge counters if present
        const counterBadges = document.querySelectorAll('.bookmark-count-badge');
        counterBadges.forEach(badge => {
          badge.textContent = data.bookmarkCount;
        });
      }
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    } finally {
      btn.disabled = false;
    }
  });
});
