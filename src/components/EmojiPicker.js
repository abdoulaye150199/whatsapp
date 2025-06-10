class EmojiPicker {
  constructor() {
    this.isVisible = false;
    this.container = null;
    this.onEmojiSelect = null;
    this.currentCategory = 'smileys';
    
    this.categories = {
      'smileys': {
        name: 'Émojis et personnes',
        icon: '😀',
        emojis: [
          '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊',
          '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛',
          '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑',
          '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒',
          '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸',
          '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺',
          '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓',
          '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩'
        ]
      },
      'people': {
        name: 'Personnes et corps',
        icon: '👋',
        emojis: [
          '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘',
          '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛',
          '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾',
          '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀',
          '👁️', '👅', '👄', '💋', '🩸', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨',
          '🧔', '👩', '🧓', '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏'
        ]
      },
      'nature': {
        name: 'Animaux et nature',
        icon: '🐶',
        emojis: [
          '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮',
          '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤',
          '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛',
          '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎',
          '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳',
          '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪'
        ]
      },
      'food': {
        name: 'Nourriture et boissons',
        icon: '🍎',
        emojis: [
          '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑',
          '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑',
          '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨',
          '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭',
          '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘',
          '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚'
        ]
      },
      'activities': {
        name: 'Activités',
        icon: '⚽',
        emojis: [
          '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓',
          '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿',
          '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️',
          '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣',
          '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫',
          '🎟️', '🎪', '🤹', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶'
        ]
      },
      'travel': {
        name: 'Voyages et lieux',
        icon: '🚗',
        emojis: [
          '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚',
          '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼', '🚁', '🛸', '✈️', '🛩️',
          '🛫', '🛬', '🪂', '💺', '🚀', '🛰️', '🚢', '⛵', '🚤', '🛥️', '🛳️', '⛴️',
          '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋',
          '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘',
          '🚙', '🛻', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛴', '🚲'
        ]
      },
      'objects': {
        name: 'Objets',
        icon: '💡',
        emojis: [
          '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙',
          '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪓',
          '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪',
          '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈',
          '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫',
          '🧪', '🌡️', '🧹', '🪠', '🧽', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️'
        ]
      },
      'symbols': {
        name: 'Symboles',
        icon: '❤️',
        emojis: [
          '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕',
          '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️',
          '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌',
          '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️',
          '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️',
          '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌'
        ]
      },
      'flags': {
        name: 'Drapeaux',
        icon: '🏁',
        emojis: [
          '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫',
          '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽',
          '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫', '🇧🇬', '🇧🇭', '🇧🇮', '🇧🇯', '🇧🇱', '🇧🇲',
          '🇧🇳', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾', '🇧🇿', '🇨🇦', '🇨🇨',
          '🇨🇩', '🇨🇫', '🇨🇬', '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳', '🇨🇴', '🇨🇵', '🇨🇷',
          '🇨🇺', '🇨🇻', '🇨🇼', '🇨🇽', '🇨🇾', '🇨🇿', '🇩🇪', '🇩🇬', '🇩🇯', '🇩🇰', '🇩🇲', '🇩🇴'
        ]
      }
    };
  }

  create() {
    this.container = document.createElement('div');
    this.container.id = 'emoji-picker';
    this.container.className = 'fixed bottom-20 left-4 w-[350px] h-[400px] bg-[#2a3942] rounded-lg shadow-2xl border border-gray-600 z-50 hidden';
    
    this.container.innerHTML = `
      <div class="flex flex-col h-full">
        <!-- Search bar -->
        <div class="p-3 border-b border-gray-600">
          <input
            type="text"
            id="emoji-search"
            placeholder="Rechercher un emoji"
            class="w-full bg-[#3b4a54] text-white rounded-lg px-3 py-2 text-sm outline-none"
          />
        </div>
        
        <!-- Category tabs -->
        <div class="flex border-b border-gray-600 bg-[#202c33]">
          ${Object.entries(this.categories).map(([key, category]) => `
            <button
              class="emoji-category-tab flex-1 p-2 text-center hover:bg-[#2a3942] transition-colors ${key === this.currentCategory ? 'bg-[#00a884] text-white' : 'text-gray-400'}"
              data-category="${key}"
              title="${category.name}"
            >
              <span class="text-lg">${category.icon}</span>
            </button>
          `).join('')}
        </div>
        
        <!-- Emoji grid -->
        <div class="flex-1 overflow-y-auto p-2">
          <div id="emoji-grid" class="grid grid-cols-8 gap-1">
            <!-- Emojis will be populated here -->
          </div>
        </div>
        
        <!-- Recently used (optional) -->
        <div class="border-t border-gray-600 p-2">
          <div class="text-xs text-gray-400 mb-2">Récemment utilisés</div>
          <div id="recent-emojis" class="flex gap-1">
            <!-- Recent emojis will be populated here -->
          </div>
        </div>
      </div>
    `;

    // Peupler les emojis initiaux
    this.populateEmojis(this.currentCategory);
    
    return this.container;
  }

  show(onEmojiSelect) {
    this.onEmojiSelect = onEmojiSelect;
    this.isVisible = true;
    this.container.classList.remove('hidden');
    this.populateEmojis(this.currentCategory);
    this.attachEvents();
  }

  hide() {
    this.isVisible = false;
    this.container.classList.add('hidden');
  }

  toggle(onEmojiSelect) {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show(onEmojiSelect);
    }
  }

  populateEmojis(category) {
    const grid = this.container.querySelector('#emoji-grid');
    const emojis = this.categories[category].emojis;
    
    grid.innerHTML = emojis.map(emoji => `
      <button
        class="emoji-btn w-8 h-8 flex items-center justify-center text-lg hover:bg-[#3b4a54] rounded transition-colors"
        data-emoji="${emoji}"
        title="${emoji}"
      >
        ${emoji}
      </button>
    `).join('');
  }

  attachEvents() {
    // Supprimer les anciens écouteurs d'événements
    if (this.handleOutsideClick) {
      document.removeEventListener('click', this.handleOutsideClick);
    }
    
    // Améliorer la détection des clics à l'extérieur
    this.handleOutsideClick = (e) => {
      if (this.isVisible && 
          !this.container.contains(e.target) && 
          !e.target.closest('#emoji-btn') &&
          !e.target.closest('#attachment-modal')) {
        this.hide();
      }
    };
    
    document.addEventListener('click', this.handleOutsideClick);

    // Category tabs
    this.container.querySelectorAll('.emoji-category-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category;
        this.switchCategory(category);
      });
    });

    // Emoji buttons
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('emoji-btn')) {
        const emoji = e.target.dataset.emoji;
        this.selectEmoji(emoji);
      }
    });

    // Search functionality
    const searchInput = this.container.querySelector('#emoji-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchEmojis(e.target.value);
      });
    }
  }

  switchCategory(category) {
    this.currentCategory = category;
    
    // Update tab styling
    this.container.querySelectorAll('.emoji-category-tab').forEach(tab => {
      if (tab.dataset.category === category) {
        tab.classList.add('bg-[#00a884]', 'text-white');
        tab.classList.remove('text-gray-400');
      } else {
        tab.classList.remove('bg-[#00a884]', 'text-white');
        tab.classList.add('text-gray-400');
      }
    });
    
    // Populate emojis for the selected category
    this.populateEmojis(category);
  }

  searchEmojis(query) {
    if (!query.trim()) {
      this.populateEmojis(this.currentCategory);
      return;
    }

    const grid = this.container.querySelector('#emoji-grid');
    const allEmojis = Object.values(this.categories).flatMap(cat => cat.emojis);
    
    // Simple search - in a real app, you'd have emoji names/keywords
    const filteredEmojis = allEmojis.filter(emoji => {
      // This is a simplified search - you'd typically search by emoji names
      return emoji.includes(query) || this.getEmojiKeywords(emoji).some(keyword => 
        keyword.toLowerCase().includes(query.toLowerCase())
      );
    });

    grid.innerHTML = filteredEmojis.slice(0, 64).map(emoji => `
      <button
        class="emoji-btn w-8 h-8 flex items-center justify-center text-lg hover:bg-[#3b4a54] rounded transition-colors"
        data-emoji="${emoji}"
        title="${emoji}"
      >
        ${emoji}
      </button>
    `).join('');
  }

  getEmojiKeywords(emoji) {
    // Simplified keyword mapping - in a real app, you'd have a comprehensive database
    const keywords = {
      '😀': ['sourire', 'heureux', 'joie'],
      '😂': ['rire', 'larmes', 'drôle'],
      '❤️': ['coeur', 'amour', 'rouge'],
      '👍': ['pouce', 'bien', 'ok'],
      '🎉': ['fête', 'célébration', 'confetti'],
      // Add more mappings as needed
    };
    
    return keywords[emoji] || [];
  }

  selectEmoji(emoji) {
    if (this.onEmojiSelect) {
      this.onEmojiSelect(emoji);
    }
    
    // Add to recent emojis
    this.addToRecent(emoji);
    
    // Hide picker
    this.hide();
  }

  addToRecent(emoji) {
    const recentContainer = this.container.querySelector('#recent-emojis');
    
    // Remove if already exists
    const existing = recentContainer.querySelector(`[data-emoji="${emoji}"]`);
    if (existing) {
      existing.remove();
    }
    
    // Add to beginning
    const emojiBtn = document.createElement('button');
    emojiBtn.className = 'emoji-btn w-6 h-6 flex items-center justify-center text-sm hover:bg-[#3b4a54] rounded transition-colors';
    emojiBtn.dataset.emoji = emoji;
    emojiBtn.textContent = emoji;
    emojiBtn.addEventListener('click', () => this.selectEmoji(emoji));
    
    recentContainer.insertBefore(emojiBtn, recentContainer.firstChild);
    
    // Keep only last 10 recent emojis
    while (recentContainer.children.length > 10) {
      recentContainer.removeChild(recentContainer.lastChild);
    }
  }
}

export { EmojiPicker };