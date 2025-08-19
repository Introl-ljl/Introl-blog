<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let categories: string[] = [];
  export let allTags: string[] = [];
  export let selectedCategory: string = '';
  export let selectedTag: string = '';
  export let searchQuery: string = '';
  
  const dispatch = createEventDispatcher();
  
  function handleCategoryChange(category: string) {
    selectedCategory = category;
    dispatch('filter', {
      category: selectedCategory,
      tag: selectedTag,
      search: searchQuery
    });
  }
  
  function handleTagChange(tag: string) {
    selectedTag = tag;
    dispatch('filter', {
      category: selectedCategory,
      tag: selectedTag,
      search: searchQuery
    });
  }
  
  function handleSearchChange() {
    dispatch('filter', {
      category: selectedCategory,
      tag: selectedTag,
      search: searchQuery
    });
  }
  
  function clearFilters() {
    selectedCategory = '';
    selectedTag = '';
    searchQuery = '';
    dispatch('filter', {
      category: '',
      tag: '',
      search: ''
    });
  }
</script>

<div class="mb-8 p-4 bg-black/5 dark:bg-white/5 rounded-lg">
  <!-- 搜索框 -->
  <div class="mb-4">
    <input
      type="text"
      placeholder="搜索项目..."
      bind:value={searchQuery}
      on:input={handleSearchChange}
      class="w-full px-4 py-2 rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
    />
  </div>
  
  <!-- 分类筛选 -->
  <div class="mb-4">
    <h3 class="text-sm font-medium mb-2 text-black/70 dark:text-white/70">分类</h3>
    <div class="flex flex-wrap gap-2">
      <button
        class="px-3 py-1 rounded-full text-sm transition-colors {selectedCategory === '' ? 'bg-[var(--primary)] text-white' : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20'}"
        on:click={() => handleCategoryChange('')}
      >
        全部
      </button>
      {#each categories as category}
        <button
          class="px-3 py-1 rounded-full text-sm transition-colors {selectedCategory === category ? 'bg-[var(--primary)] text-white' : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20'}"
          on:click={() => handleCategoryChange(category)}
        >
          {category}
        </button>
      {/each}
    </div>
  </div>
  
  <!-- 标签筛选 -->
  <div class="mb-4">
    <h3 class="text-sm font-medium mb-2 text-black/70 dark:text-white/70">标签</h3>
    <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
      <button
        class="px-3 py-1 rounded-full text-sm transition-colors {selectedTag === '' ? 'bg-[var(--primary)] text-white' : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20'}"
        on:click={() => handleTagChange('')}
      >
        全部标签
      </button>
      {#each allTags as tag}
        <button
          class="px-3 py-1 rounded-full text-sm transition-colors {selectedTag === tag ? 'bg-[var(--primary)] text-white' : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20'}"
          on:click={() => handleTagChange(tag)}
        >
          {tag}
        </button>
      {/each}
    </div>
  </div>
  
  <!-- 清除筛选 -->
  {#if selectedCategory || selectedTag || searchQuery}
    <button
      class="text-sm text-[var(--primary)] hover:underline"
      on:click={clearFilters}
    >
      清除所有筛选
    </button>
  {/if}
</div>