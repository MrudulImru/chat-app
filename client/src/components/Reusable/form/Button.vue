<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <slot name="icon-left" v-if="$slots['icon-left']" class="mr-2"></slot>
    <span>{{ label }}</span>
    <slot name="icon-right" v-if="$slots['icon-right']" class="ml-2"></slot>

    <span v-if="loading" class="ml-2">
      <svg
        class="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "success" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Button",
  type: "button",
  variant: "primary",
  size: "medium",
  disabled: false,
  loading: false,
  fullWidth: false,
});

const emit = defineEmits(["click"]);

// Dynamic button classes based on variant and state
const buttonClasses = computed(() => {
  const baseClasses =
    "rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

  // Variant styles
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
    outline:
      "border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-300",
  };

  // Size styles
  const sizeStyles = {
    small: "py-1 px-2 text-sm",
    medium: "py-2 px-4",
    large: "py-3 px-6 text-lg",
  };

  // State styles
  const stateStyles = {
    disabled: "opacity-50 cursor-not-allowed",
    loading: "cursor-wait",
  };

  return [
    baseClasses,
    variantStyles[props.variant],
    sizeStyles[props.size],
    props.fullWidth ? "w-full" : "",
    props.disabled ? stateStyles.disabled : "",
    props.loading ? stateStyles.loading : "",
  ].join(" ");
});

// Click handler with loading and disabled state prevention
function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault();
    return;
  }
  emit("click", event);
}
</script>
