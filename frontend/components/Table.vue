<script setup lang="ts">
interface Column {
  field: string;
  label: string;
}

interface TableProps {
  columns: Column[];
  items: Record<string, any>[];
}

defineProps<TableProps>();
</script>
<template>
  <div class="flex flex-col overflow-x-auto">
    <table class="w-full text-left text-gray-900">
      <thead class="text-xs text-gray-700 bg-gray-200">
        <tr>
          <th v-for="column in columns" :key="column?.field ?? column" scope="col" class="px-6 py-3 border">
            {{ column?.label ?? column }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index" class="odd:bg-white even:bg-gray-50">
          <td v-for="column in columns" :key="column.field" class="px-4 border py-2">
            <slot :name="column.field" :item="item">
              {{ item[column.field as keyof typeof item] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
