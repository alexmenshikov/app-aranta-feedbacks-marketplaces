<script setup>
import { useCompanyStore } from "../stores/companyStore.js";
import { computed } from "vue";
import {
  Col as ACol,
  FormItem as AFormItem,
  Row as ARow,
  Select as ASelect,
} from "ant-design-vue";

const store = useCompanyStore();

const selectedMarketplaces = computed({
  get: () => store.selectedMarketplaces,
  set: value => (store.selectedMarketplaces = value),
});

const selectedCompanies = computed({
  get: () => store.selectedCompanies,
  set: value => (store.selectedCompanies = value),
});

const marketplaceOptions = [
  { label: "Wildberries", value: "wb" },
  { label: "Ozon", value: "ozon" },
  { label: "Яндекс", value: "yandex" },
];

const companyOptions = computed(() =>
  store.companies.map(company => ({ label: company.name, value: company.id }))
);
</script>

<template>
  <a-row :gutter="24">
    <a-col :span="8">
      <a-form-item label="Маркетплейс" name="marketplaceSelected">
        <a-select
          v-model:value="selectedMarketplaces"
          :options="marketplaceOptions"
          @change="store.addMarketplace()"
          placeholder="Выберите из списка"
          mode="multiple"
        />
      </a-form-item>
    </a-col>

    <a-col :span="16">
      <a-form-item label="Компания" name="companySelected">
        <a-select
          v-model:value="selectedCompanies"
          :options="companyOptions"
          @change="store.addCompany()"
          placeholder="Выберите из списка"
          mode="multiple"
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>
