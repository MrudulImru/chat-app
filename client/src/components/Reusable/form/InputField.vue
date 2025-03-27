<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="inputClasses"
      @input="updateValue"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
defineOptions({
  name: "InputField",
});
interface Props {
  modelValue?: string | number;
  label?: string;
  type?: "text" | "password" | "email" | "number";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  variant?: "default" | "primary" | "error";
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  variant: "default",
  required: false,
  disabled: false,
});

const emit = defineEmits(["update:modelValue"]);

// Dynamic input classes based on variant and state
const inputClasses = computed(() => {
  const baseClasses =
    "mt-1 block w-full rounded-md shadow-sm p-2 border focus:outline-none";

  const variantClasses = {
    default:
      "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200",
    primary:
      "border-blue-300 focus:border-blue-600 focus:ring focus:ring-blue-300",
    error: "border-red-500 focus:border-red-600 focus:ring focus:ring-red-200",
  };

  const stateClasses = {
    disabled: "cursor-not-allowed bg-gray-100 text-gray-500",
  };

  return [
    baseClasses,
    variantClasses[props.variant],
    props.disabled ? stateClasses.disabled : "",
    props.error ? variantClasses.error : "",
  ].join(" ");
});

// Update value and emit input event
function updateValue(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>
