import { computed, ref, toRef } from "vue";
import type { Ref } from "vue";
import type { MaybeRefOrGetter } from "vue";

export interface useCycleListConfig {
  fallbackIndex?: number;
  fallbackValue?: any;
}

export const useCycleListConfigDefaults: useCycleListConfig = {
  fallbackIndex: undefined,
  fallbackValue: undefined,
};

export const useCycleList = (
  list: MaybeRefOrGetter<any[]>,
  config?: useCycleListConfig,
) => {
  const _config = {
    ...useCycleListConfigDefaults,
    ...config,
  };

  const activeIndex = ref(0);

  const _list = toRef(list);

  const state = computed({
    get() {
      return _list.value[activeIndex.value];
    },
    set(value) {
      const foundIndex = _list.value.indexOf(value);
      if (!foundIndex || foundIndex === -1) {
        throw new Error(`Value ${value} not found in list`);
      }

      activeIndex.value = foundIndex;
    },
  });

  function next() {
    if (activeIndex.value === _list.value.length - 1) {
      activeIndex.value = 0;
    } else {
      activeIndex.value++;
    }
  }

  function prev() {
    if (activeIndex.value === 0) {
      activeIndex.value = _list.value.length - 1;
    } else {
      activeIndex.value--;
    }
  }

  function go(index: number) {
    if (index >= _list.value.length) {
      throw new Error(
        `Cannot go to index ${index}. The list provided to useCycleList is not that long.`,
      );
    } else {
      activeIndex.value = index;
    }
  }

  return {
    state,
    prev,
    next,
    go,
  };
};
