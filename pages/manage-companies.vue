<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { Form } from "vee-validate";
import { onMounted, ref } from "vue";

import type { CompanyData } from "~/interfaces/company.interface";

import BaseFormSection from "~/components/form/base-form-section.vue";
import BaseInput from "~/components/form/base-input.vue";
import BaseSelect from "~/components/form/base-select.vue";
import Table from "~/components/table/table.vue";
import { companySchema } from "~/schemas/company.schema";
import { useLoaderStore } from "~/stores/loader/loader";
import { useToastStore } from "~/stores/toast/toast";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const toast = useToastStore();
const loader = useLoaderStore();

const validateSchema = toTypedSchema(companySchema);

const columns = [
  { key: "name", label: "Company Name" },
  { key: "company_type", label: "Type" },
  { key: "gst_no", label: "GST No" },
  { key: "name_of_owner", label: "Owner" },
  { key: "mobile_no_1", label: "Mobile" },
];

const companies = ref<CompanyData[]>([]);

async function fetchCompanies() {
  loader.show("Loading Companies...");
  try {
    const data: any = await $fetch("/api/company");
    companies.value = data?.data || [];
  }
  catch (error: any) {
    toast.show(error._data?.message || "Failed to fetch companies", "error");
  }
  finally {
    loader.hide();
  }
}

onMounted(() => {
  fetchCompanies();
});

// Edit functionality
const editModal = ref<HTMLDialogElement | null>(null);
const selectedCompany = ref<CompanyData | null>(null);

function openEditModal(company: CompanyData) {
  selectedCompany.value = JSON.parse(JSON.stringify(company)); // Deep copy to avoid reactive mutations before save
  editModal.value?.showModal();
}

function closeEditModal() {
  editModal.value?.close();
  selectedCompany.value = null;
}

async function onUpdateCompany(values: any) {
  if (!selectedCompany.value)
    return;

  loader.show("Updating Company...");
  try {
    const response: any = await $fetch(`/api/company/${selectedCompany.value._id}`, {
      method: "PUT",
      body: values,
    });

    toast.show(response.message || "Company updated successfully", "success");
    closeEditModal();
    await fetchCompanies();
  }
  catch (error: any) {
    toast.show(error._data?.message || "Failed to update company", "error");
  }
  finally {
    loader.hide();
  }
}

// Delete functionality
const deleteModal = ref<HTMLDialogElement | null>(null);
const companyToDelete = ref<CompanyData | null>(null);

function openDeleteModal(company: CompanyData) {
  companyToDelete.value = company;
  deleteModal.value?.showModal();
}

function closeDeleteModal() {
  deleteModal.value?.close();
  companyToDelete.value = null;
}

async function confirmDelete() {
  if (!companyToDelete.value)
    return;

  loader.show("Deleting Company...");
  try {
    const response: any = await $fetch(`/api/company/${companyToDelete.value._id}`, {
      method: "DELETE",
    });

    toast.show(response.message || "Company deleted successfully", "success");
    closeDeleteModal();
    await fetchCompanies();
  }
  catch (error: any) {
    toast.show(error._data?.message || "Failed to delete company", "error");
  }
  finally {
    loader.hide();
  }
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-white">
        Manage Companies
      </h1>
      <NuxtLink to="/add-company" class="btn btn-primary btn-sm">
        Add New Company
      </NuxtLink>
    </div>

    <!-- Table -->
    <Table
      :columns="columns"
      :data="companies"
      searchable
      :search-keys="['name', 'gst_no', 'name_of_owner', 'mobile_no_1', 'company_type']"
      actions
    >
      <template #actions="{ row }">
        <div class="flex gap-2 justify-end">
          <button class="btn btn-ghost btn-xs text-blue-400 hover:text-blue-300" @click="openEditModal(row)">
            Edit
          </button>
          <button class="btn btn-ghost btn-xs text-red-400 hover:text-red-300" @click="openDeleteModal(row)">
            Delete
          </button>
        </div>
      </template>
    </Table>

    <!-- Edit Modal -->
    <dialog ref="editModal" class="modal">
      <div class="modal-box w-11/12 max-w-4xl bg-[#111827] border border-gray-800 text-white">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-bold text-xl">
            Edit Company
          </h3>
          <button class="btn btn-sm btn-circle btn-ghost" @click="closeEditModal">
            ✕
          </button>
        </div>

        <Form
          v-if="selectedCompany"
          class="space-y-6"
          :validation-schema="validateSchema"
          :initial-values="selectedCompany"
          @submit="onUpdateCompany"
        >
          <BaseFormSection title="Company Details">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput name="name" label="Company Name" />
              <BaseSelect
                name="company_type"
                label="Company Type"
                :options="[
                  { label: 'Sales', value: 'sales' },
                  { label: 'Purchase', value: 'purchase' },
                ]"
              />
            </div>
            <BaseInput name="gst_no" label="GST Number" />
            <BaseInput name="name_of_owner" label="Owner Name" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput name="mobile_no_1" label="Mobile Number 1" />
              <BaseInput name="mobile_no_2" label="Mobile Number 2" />
            </div>
          </BaseFormSection>

          <BaseFormSection title="Address">
            <BaseInput name="address.address_line_1" label="Address Line 1" />
            <BaseInput name="address.address_line_2" label="Address Line 2" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput name="address.city" label="City" />
              <BaseInput name="address.state" label="State" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput name="address.country" label="Country" />
              <BaseInput name="address.zipcode" label="Zip Code" type="number" />
            </div>
          </BaseFormSection>

          <div class="modal-action">
            <button type="button" class="btn btn-ghost" @click="closeEditModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Save Changes
            </button>
          </div>
        </Form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeEditModal">
          close
        </button>
      </form>
    </dialog>

    <!-- Delete Confirmation Modal -->
    <dialog ref="deleteModal" class="modal">
      <div class="modal-box bg-[#1f2937] text-white border border-gray-700">
        <h3 class="font-bold text-lg text-red-500">
          Confirm Deletion
        </h3>
        <p class="py-4">
          Are you sure you want to delete the company <span class="font-bold">"{{ companyToDelete?.name
          }}"</span>? This action cannot be undone.
        </p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="closeDeleteModal">
            Cancel
          </button>
          <button class="btn btn-error text-white" @click="confirmDelete">
            Delete
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeDeleteModal">
          close
        </button>
      </form>
    </dialog>
  </div>
</template>
