<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { format } from "date-fns";
import { Form } from "vee-validate";
import { computed, ref } from "vue";
import * as z from "zod";

import type { Company, MonthlyRegister } from "~/interfaces/company.interface";
import type { CompanyApiResponse } from "~/types/companyresponse.types";

import { CompanyType, GstType, Months } from "@/enums/form.enums";
import BaseTypeaheadAsync from "~/components/form/base-typeahead.vue";
import { useLoaderStore } from "~/stores/loader/loader";
import { useToastStore } from "~/stores/toast/toast";

import BaseFormSection from "../components/form/base-form-section.vue";
import BaseInput from "../components/form/base-input.vue";
import BaseSelect from "../components/form/base-select.vue";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

// ── Stores ──────────────────────────────────────────────
const toast = useToastStore();
const loader = useLoaderStore();

// ── Refs ────────────────────────────────────────────────
const companyTypeaheadRef = ref<{ clear: () => void } | null>(null);
const step = ref(1);
const records = ref<Company[]>([]);
const editingIndex = ref<number | null>(null);
const selectedPeriod = ref<{ month: Months | null; year: number | null }>({
  month: null,
  year: null,
});

// ── Helpers ─────────────────────────────────────────────
function enumToOptions(e: Record<string, string>) {
  return Object.entries(e).map(([key, value]) => ({
    label: key.charAt(0) + key.slice(1).toLowerCase(),
    value,
  }));
}

function computeTax(grossAmount: number, gstType: string, extraCharge: number) {
  if (gstType === "inter_state") {
    const tax = grossAmount * 0.09;
    return {
      cgst: tax,
      sgst: tax,
      igst: 0,
      totalTax: tax * 2,
      totalAfterTax: grossAmount + tax * 2 + extraCharge,
    };
  }
  const tax = grossAmount * 0.18;
  return {
    cgst: 0,
    sgst: 0,
    igst: tax,
    totalTax: tax,
    totalAfterTax: grossAmount + tax + extraCharge,
  };
}

function sumField(field: keyof Company) {
  return computed(() =>
    records.value.reduce(
      (sum: number, r) => sum + (Number(r[field]) || 0),
      0,
    ),
  );
}

function computeTotals(companies: Company[]) {
  return {
    gross: companies.reduce((a, r) => a + r.grossAmount, 0),
    net: companies.reduce((a, r) => a + r.totalAfterTax, 0),
    gst: companies.reduce((a, r) => a + r.cgst + r.sgst + r.igst, 0),
  };
}

// ── Select options ──────────────────────────────────────
const monthOptions = enumToOptions(Months);
const companyTypeOptions = enumToOptions(CompanyType);
const gstTypeOptions = enumToOptions(GstType);

// ── Validation schemas ──────────────────────────────────
const schemas = [
  z.object({
    month: z.nativeEnum(Months, { errorMap: () => ({ message: "Select month" }) }),
    year: z.number().min(4, "Invalid Year"),
  }),
  z.object({
    invoiceNo: z.string().min(1, "Required"),
    invoiceDate: z.coerce
      .date()
      .max(new Date(), { message: "Invoice date cannot be in future" }),
    companyName: z.string().min(1, "Required"),
    gstNo: z.string().optional(),
    cgst: z.number().optional().default(0),
    sgst: z.number().optional().default(0),
    igst: z.number().optional().default(0),
    companyType: z.enum(["sales", "purchase"]),
    grossAmount: z.number().min(1, "Min 1"),
    gstType: z.enum(["inter_state", "out_of_state"]),
    extraCharge: z.number().default(0),
    totalTax: z.number().optional().default(0),
    totalAfterTax: z.number().optional().default(0),
    numberOfItems: z.number().default(0),
    totalQuantity: z.number().default(0),
  }),
];

const currentSchema = computed(() => toTypedSchema(schemas[step.value - 1]));

// ── Computed totals ─────────────────────────────────────
const grossTotal = sumField("grossAmount");
const extrasTotal = sumField("extraCharge");
const igstTotal = sumField("igst");
const cgstTotal = sumField("cgst");
const sgstTotal = sumField("sgst");
const totalTaxTotal = sumField("totalTax");
const grandTotal = sumField("totalAfterTax");
const numberOfItemsTotal = sumField("numberOfItems");
const totalQuantityTotal = sumField("totalQuantity");

// ── Table column definitions ────────────────────────────
type TableColumn = {
  label: string;
  key: keyof Company | "actions";
  align?: "left" | "right" | "center";
  format?: (val: any, record: Company) => string;
  totalValue?: () => number;
  bold?: boolean;
};

const tableColumns: TableColumn[] = [
  { label: "Invoice No", key: "invoiceNo" },
  {
    label: "Date",
    key: "invoiceDate",
    format: v => format(v, "dd/MM/yyyy"),
  },
  { label: "Company", key: "companyName" },
  { label: "GST No.", key: "gstNo" },
  { label: "Type", key: "companyType" },
  { label: "Gross", key: "grossAmount", align: "right", format: v => `₹${v}`, totalValue: () => grossTotal.value },
  { label: "Extra", key: "extraCharge", align: "right", format: v => `₹${v}`, totalValue: () => extrasTotal.value },
  { label: "IGST (18%)", key: "igst", align: "right", format: v => `₹${v}`, totalValue: () => igstTotal.value },
  { label: "CGST (9%)", key: "cgst", align: "right", format: v => `₹${v}`, totalValue: () => cgstTotal.value },
  { label: "SGST (9%)", key: "sgst", align: "right", format: v => `₹${v}`, totalValue: () => sgstTotal.value },
  { label: "Total Tax", key: "totalTax", align: "right", format: v => `₹${v}`, totalValue: () => totalTaxTotal.value },
  { label: "Total", key: "totalAfterTax", align: "right", format: v => `₹${v}`, bold: true, totalValue: () => grandTotal.value },
  { label: "No. of Items", key: "numberOfItems", align: "right", totalValue: () => numberOfItemsTotal.value },
  { label: "Total Qty", key: "totalQuantity", align: "right", totalValue: () => totalQuantityTotal.value },
  { label: "Actions", key: "actions", align: "center" },
];

// ── API / Actions ───────────────────────────────────────
async function searchCompanies(query: string) {
  const res = await $fetch<CompanyApiResponse>("/api/companyfilter", {
    query: { search: query },
  });
  return res.data.map(company => ({
    label: company.name,
    value: company._id,
    raw: company,
  }));
}

function handleStepSubmit(values: Record<string, any>, { resetForm }: { resetForm: (opts?: any) => void }) {
  if (step.value === 1) {
    selectedPeriod.value = { month: values.month, year: values.year };
    step.value = 2;
    return;
  }

  const record = { ...values } as Company;

  if (editingIndex.value !== null) {
    records.value[editingIndex.value] = record;
    editingIndex.value = null;
  }
  else {
    records.value.push(record);
  }

  resetForm({
    values: {
      ...values,
      invoiceNo: "",
      invoiceDate: null,
      gstType: null,
      companyName: null,
      companyType: null,
      grossAmount: 0,
      gstNo: null,
      extraCharge: 0,
      totalTax: 0,
      numberOfItems: 0,
      totalQuantity: 0,
      totalAfterTax: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
    },
  });

  companyTypeaheadRef.value?.clear();
}

function editRow(index: number, setValues: (values: Record<string, any>) => void) {
  editingIndex.value = index;
  setValues(records.value[index]);
}

function deleteRow(index: number) {
  records.value.splice(index, 1);
}

async function createExcelSheet() {
  const salesCompanies = records.value.filter(r => r.companyType === "sales");
  const purchaseCompanies = records.value.filter(r => r.companyType === "purchase");

  const salesTotals = computeTotals(salesCompanies as Company[]);
  const purchaseTotals = computeTotals(purchaseCompanies as Company[]);

  const query: MonthlyRegister = {
    year: Number(selectedPeriod.value.year),
    month: selectedPeriod.value.month as string,
    sales: salesCompanies as Company[],
    purchase: purchaseCompanies as Company[],
    salesGrossTotal: salesTotals.gross,
    purchaseGrossTotal: purchaseTotals.gross,
    salesNetTotal: salesTotals.net,
    purchaseNetTotal: purchaseTotals.net,
    salesGstTotal: salesTotals.gst,
    purchaseGstTotal: purchaseTotals.gst,
  };

  loader.show("Generating Excel Sheet...");

  try {
    const response = await $fetch.raw("/api/monthlyregister", {
      method: "POST",
      body: query,
      responseType: "arrayBuffer",
    });

    const blob = new Blob([response._data as BlobPart], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedPeriod.value.month}-${selectedPeriod.value.year}-register.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.show("Excel Sheet Downloaded successfully", "success");
  }
  catch (error: any) {
    toast.show(error.message || "Something went wrong", "error");
  }
  finally {
    loader.hide();
  }
}

function onGrossAmountInput(e: Event, values: Record<string, any>, setFieldValue: (field: string, value: any) => void) {
  const val = Number.parseFloat((e.target as HTMLInputElement).value) || 0;
  const extra = Number.parseFloat(values.extraCharge) || 0;
  const tax = computeTax(val, values.gstType, extra);
  setFieldValue("cgst", tax.cgst);
  setFieldValue("sgst", tax.sgst);
  setFieldValue("igst", tax.igst);
  setFieldValue("totalTax", tax.totalTax);
  setFieldValue("totalAfterTax", tax.totalAfterTax);
}

function onExtraChargeInput(e: Event, values: Record<string, any>, setFieldValue: (field: string, value: any) => void) {
  const val = Number.parseFloat((e.target as HTMLInputElement).value) || 0;
  setFieldValue("totalAfterTax", values.grossAmount + values.totalTax + val);
}
</script>

<template>
  <div class="max-w-full mx-auto p-3 text-white min-h-screen">
    <Form v-slot="{ values, setFieldValue, setValues }" :validation-schema="currentSchema" @submit="handleStepSubmit">
      <!-- Step 1: Select Period -->
      <BaseFormSection v-if="step === 1" title="Select Period">
        <div class="grid grid-cols-2 gap-4">
          <BaseSelect name="month" label="Month" :options="monthOptions" />
          <BaseInput name="year" label="Year" type="number" />
        </div>
        <button type="submit" class="mt-6 cursor-pointer btn btn-primary">
          Next
          <Icon icon="tabler:arrow-right" />
        </button>
      </BaseFormSection>

      <!-- Step 2: Add / Edit Records -->
      <div v-if="step === 2" class="space-y-8">
        <BaseFormSection :title="editingIndex !== null ? 'Edit Record' : 'Add Company Details'">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BaseInput
              name="invoiceNo"
              label="Invoice Number"
              @input="(val: Event) => setFieldValue('invoiceNo', (val.target as HTMLInputElement).value)"
            />
            <BaseInput
              name="invoiceDate"
              label="Invoice Date"
              type="date"
              @input="(val: Event) => setFieldValue('invoiceDate', (val.target as HTMLInputElement).value)"
            />
            <BaseTypeaheadAsync
              ref="companyTypeaheadRef"
              name="companyId"
              label="Company"
              placeholder="Search company..."
              :fetch-options="searchCompanies"
              @select="(option: any) => {
                const company = option.raw;
                if (!company) return;
                setFieldValue('companyName', company.name);
                setFieldValue('gstNo', company.gst_no);
                setFieldValue('companyType', company.company_type);
              }"
            />

            <BaseInput name="gstNo" label="GST No." disabled />
            <BaseSelect name="companyType" label="Type" :options="companyTypeOptions" />
            <BaseSelect name="gstType" label="GST Mode" :options="gstTypeOptions" />
            <BaseInput
              name="grossAmount"
              label="Gross Amount"
              type="number"
              @input="(e: Event) => onGrossAmountInput(e, values, setFieldValue)"
            />
            <BaseInput
              name="extraCharge"
              label="Extra Charge"
              type="number"
              @input="(e: Event) => onExtraChargeInput(e, values, setFieldValue)"
            />

            <!-- Tax display cards -->
            <div class="md:col-span-3 grid grid-cols-4 gap-4">
              <template v-if="values.gstType === 'inter_state'">
                <div class="p-3 rounded-lg bg-white/5 border border-white/10">
                  <span class="text-xs text-gray-400">CGST (9%)</span>
                  <p class="font-bold">
                    {{ (values.grossAmount * 0.09).toFixed(2) }}
                  </p>
                </div>
                <div class="p-3 rounded-lg bg-white/5 border border-white/10">
                  <span class="text-xs text-gray-400">SGST (9%)</span>
                  <p class="font-bold">
                    {{ (values.grossAmount * 0.09).toFixed(2) }}
                  </p>
                </div>
              </template>
              <template v-else>
                <div class="p-3 rounded-lg bg-white/5 border border-white/10">
                  <span class="text-xs text-gray-400">IGST (18%)</span>
                  <p class="font-bold">
                    {{ (values.grossAmount * 0.18).toFixed(2) }}
                  </p>
                </div>
              </template>
              <BaseInput name="totalTax" label="Total Tax" disabled />
              <BaseInput name="totalAfterTax" label="Total After Tax" disabled />
            </div>

            <!-- Items & Quantity row -->
            <div class="md:col-span-4 grid grid-cols-2 gap-4">
              <BaseInput
                name="numberOfItems"
                label="Number of Items"
                type="number"
              />
              <BaseInput
                name="totalQuantity"
                label="Total Quantity"
                type="number"
              />
            </div>
          </div>

          <div class="flex gap-3 mt-4">
            <button
              type="submit"
              class="btn btn-primary border border-green-600 bg-green-600 hover:bg-green-600 shadow-sm shadow-green-600"
            >
              {{ editingIndex !== null ? 'Update Record' : 'Add to Table' }}
            </button>
            <button type="button" class="btn btn-outline" @click="step = 1">
              Change Period
            </button>
          </div>
        </BaseFormSection>

        <!-- Records table -->
        <div v-if="records.length" class="overflow-hidden rounded-2xl border border-white/10 bg-[#141414]">
          <table class="w-full text-left">
            <thead class="bg-teal-600 text-white shadow-lg uppercase text-xs">
              <tr>
                <th
                  v-for="col in tableColumns"
                  :key="col.key"
                  class="p-3"
                  :class="{ 'text-right': col.align === 'right', 'text-center': col.align === 'center' }"
                >
                  {{ col.label }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y bg-white text-gray-600 divide-white/8">
              <tr
                v-for="(record, index) in records"
                :key="index"
                class="hover:bg-white/8 hover:text-teal-700 text-sm font-semibold cursor-pointer transition-colors"
              >
                <template v-for="col in tableColumns" :key="col.key">
                  <td v-if="col.key === 'actions'" class="p-3">
                    <div class="flex justify-center gap-4">
                      <button
                        type="button"
                        class="text-blue-400 hover:scale-150 cursor-pointer transition-transform"
                        @click="editRow(index, setValues)"
                      >
                        <Icon icon="tabler:edit" size="20" />
                      </button>
                      <button
                        type="button"
                        class="text-red-400 hover:scale-150 cursor-pointer transition-transform"
                        @click="deleteRow(index)"
                      >
                        <Icon icon="tabler:trash" size="20" />
                      </button>
                    </div>
                  </td>
                  <td
                    v-else
                    class="p-3"
                    :class="{
                      'text-right': col.align === 'right',
                      'text-center': col.align === 'center',
                      'font-bold text-green-400': col.bold,
                      'capitalize text-sm': col.key === 'companyType',
                    }"
                  >
                    {{ col.format ? col.format(record[col.key], record) : record[col.key] }}
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary totals -->
        <div v-if="records.length" class="w-full flex justify-end">
          <div class="overflow-hidden w-3/4 rounded-2xl border border-white/10 bg-[#141414]">
            <table class="w-full text-left">
              <thead class="bg-red-400 text-white shadow-lg uppercase text-xs">
                <tr>
                  <th v-for="col in tableColumns.filter(c => c.totalValue)" :key="col.key" class="p-3 text-right">
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white text-gray-600 text-sm font-semibold">
                <tr>
                  <td
                    v-for="col in tableColumns.filter(c => c.totalValue)"
                    :key="col.key"
                    class="p-3 text-right"
                    :class="{ 'font-bold text-green-600': col.bold }"
                  >
                    ₹{{ col.totalValue!() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Form>

    <div v-if="step === 2" class="flex w-full justify-end gap-3 mt-4">
      <div>
        <button
          :disabled="!records.length"
          :class="[!records.length ? 'btn btn-disabled' : 'btn btn-primary']"
          @click="() => createExcelSheet()"
        >
          Create Excel Sheet
        </button>
      </div>
    </div>
  </div>
</template>
