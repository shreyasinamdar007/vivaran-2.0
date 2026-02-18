<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { format } from "date-fns";
import { Form } from "vee-validate";
import { computed, ref } from "vue";
import * as z from "zod";

import { CompanyType, GstType, Months } from "@/enums/form.enums";

import BaseFormSection from "../components/form/base-form-section.vue";
import BaseInput from "../components/form/base-input.vue";
import BaseSelect from "../components/form/base-select.vue";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const monthOptions = Object.entries(Months).map(([key, value]) => ({
  label: key.charAt(0) + key.slice(1).toLowerCase(),
  value,
}));

const companyType = Object.entries(CompanyType).map(([key, value]) => ({
  label: key.charAt(0) + key.slice(1).toLowerCase(),
  value,
}));

const gstType = Object.entries(GstType).map(([key, value]) => ({
  label: key.charAt(0) + key.slice(1).toLowerCase(),
  value,
}));

const step = ref(1);
const records = ref<any[]>([]);
const editingIndex = ref<number | null>(null);

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
    cgst: z.number().optional(),
    sgst: z.number().optional(),
    igst: z.number().optional(),
    companyType: z.enum(["sales", "purchase"]),
    grossAmount: z.number().min(1, "Min 1"),
    gstType: z.enum(["inter_state", "out_of_state"]),
    extraCharge: z.number().default(0),
    totalTax: z.number().optional(),
    totalAfterTax: z.number().optional(),
  }),
];

const grossTotal = computed(() =>
  records.value.reduce((sum, r) => sum + (r.grossAmount || 0), 0),
);

const extrasTotal = computed(() =>
  records.value.reduce((sum, r) => sum + (r.extraCharge || 0), 0),
);

const igstTotal = computed(() =>
  records.value.reduce((sum, r) => sum + (r.igst || 0), 0),
);

const cgstTotal = computed(() =>
  records.value.reduce((sum, r) => sum + (r.cgst || 0), 0),
);

const sgstTotal = computed(() =>
  records.value.reduce((sum, r) => sum + (r.sgst || 0), 0),
);

const totalTaxTotal = computed(() =>
  records.value.reduce((sum, r) => sum + (r.totalTax || 0), 0),
);

const grandTotal = computed(() =>
  records.value.reduce((sum, r) => sum + (r.totalAfterTax || 0), 0),
);

const currentSchema = computed(() => toTypedSchema(schemas[step.value - 1]));

function handleStepSubmit(values: any, { resetForm }: any) {
  if (step.value === 1) {
    step.value = 2;
  }
  else {
    const record = { ...values };

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
        companyName: "",
        companyType: null,
        grossAmount: 0,
        extraCharge: 0,
        totalTax: 0,
        totalAfterTax: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
      },
    });
  }
}

function editRow(index: number, setValues: (values: Record<string, any>) => void) {
  editingIndex.value = index;
  setValues(records.value[index]);
}

function deleteRow(index: number) {
  records.value.splice(index, 1);
}
</script>

<template>
  <div class="max-w-full mx-auto p-3 text-white min-h-screen">
    <Form v-slot="{ values, setFieldValue, setValues }" :validation-schema="currentSchema" @submit="handleStepSubmit">
      <BaseFormSection v-if="step === 1" title="Select Period">
        <div class="grid grid-cols-2 gap-4">
          <BaseSelect name="month" label="Month" :options="monthOptions" />
          <BaseInput name="year" label="Year" type="number" />
        </div>
        <button type="submit" class="mt-6 bg-blue-600 px-8 py-2 rounded-xl flex items-center gap-2">
          Next
          <Icon icon="tabler:arrow-right" />
        </button>
      </BaseFormSection>

      <div v-if="step === 2" class="space-y-8">
        <BaseFormSection :title="editingIndex !== null ? 'Edit Record' : 'Add Company Details'">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BaseInput
              name="invoiceNo" label="Invoice Number"
              @input="val => setFieldValue('invoiceNo', val.target.value)"
            />
            <BaseInput
              name="invoiceDate" label="Invoice Date" type="date"
              @input="val => setFieldValue('invoiceDate', val.target.value)"
            />
            <BaseInput
              name="companyName" label="Company Name"
              @input="val => setFieldValue('gstNo', val.target.value === 'Google' ? '07AAACG' : 'N/A')"
            />
            <BaseInput name="gstNo" label="GST No." disabled />
            <BaseSelect name="companyType" label="Type" :options="companyType" />

            <BaseSelect name="gstType" label="GST Mode" :options="gstType" />
            <BaseInput
              name="grossAmount" label="Gross Amount" type="number" @input="(e) => {
                const val = parseFloat(e.target.value) || 0;
                const extra = parseFloat(values.extraCharge) || 0;

                if (values.gstType === 'inter_state') {
                  const tax = val * 0.09;
                  setFieldValue('cgst', tax);
                  setFieldValue('sgst', tax);
                  setFieldValue('igst', 0);
                  setFieldValue('totalAfterTax', val + (tax * 2) + extra);
                  setFieldValue('totalTax', tax * 2);
                }
                else {
                  const tax = val * 0.18;
                  setFieldValue('igst', tax);
                  setFieldValue('cgst', 0);
                  setFieldValue('sgst', 0);
                  setFieldValue('totalAfterTax', val + (tax * 2) + extra);
                  setFieldValue('totalTax', tax * 2);
                }
              }"
            />
            <BaseInput
              name="extraCharge" label="Extra Charge" type="number" @input="(e) => {
                const val = parseFloat(e.target.value) || 0;
                setFieldValue(
                  'totalAfterTax',
                  values.grossAmount + values.totalTax + val,
                );
              }"
            />

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
          </div>

          <div class="flex gap-3 mt-4">
            <button type="submit" class="bg-green-600 px-6 py-2 rounded-xl font-bold">
              {{ editingIndex !== null ? 'Update Record' : 'Add to Table' }}
            </button>
            <button type="button" class="text-gray-400 underline" @click="step = 1">
              Change Period
            </button>
          </div>
        </BaseFormSection>

        <div v-if="records.length" class="overflow-hidden rounded-2xl border border-white/10 bg-[#141414]">
          <table class="w-full text-left">
            <thead class="bg-teal-600 text-white shadow-lg uppercase text-xs">
              <tr>
                <th class="p-3">
                  Invoice No
                </th>
                <th class="p-3">
                  Date
                </th>
                <th class="p-3">
                  Company
                </th>
                <th class="p-3">
                  GST No.
                </th>
                <th class="p-3">
                  Type
                </th>
                <th class="p-3 text-right">
                  Gross
                </th>
                <th class="p-3 text-right">
                  Extra
                </th>
                <th class="p-3 text-right">
                  IGST (18%)
                </th>
                <th class="p-3 text-right">
                  CGST (9%)
                </th>
                <th class="p-3 text-right">
                  SGST (9%)
                </th>
                <th class="p-3 text-right">
                  Total Tax
                </th>
                <th class="p-3 text-right">
                  Total
                </th>
                <th class="p-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y bg-white text-gray-600 divide-white/8">
              <tr
                v-for="(record, index) in records" :key="index"
                class="hover:bg-white/8 hover:text-teal-700 text-sm font-semibold cursor-pointer transition-colors"
              >
                <td class="p-3">
                  {{ record.invoiceNo }}
                </td>
                <td class="p-3">
                  {{ format(record.invoiceDate, 'dd/MM/yyyy') }}
                </td>
                <td class="p-3">
                  {{ record.companyName }}
                </td>
                <td class="p-3">
                  {{ record.gstNo }}
                </td>
                <td class="p-3 capitalize text-sm">
                  {{ record.companyType }}
                </td>
                <td class="p-3 text-right">
                  ₹{{ record.grossAmount }}
                </td>
                <td class="p-3 text-right">
                  ₹{{ record.extraCharge }}
                </td>
                <td class="p-3 text-right">
                  ₹{{ record.igst }}
                </td>
                <td class="p-3 text-right">
                  ₹{{ record.cgst }}
                </td>
                <td class="p-3 text-right">
                  ₹{{ record.sgst }}
                </td>
                <td class="p-3 text-right">
                  ₹{{ record.totalTax }}
                </td>
                <td class="p-3 text-right font-bold text-green-400">
                  ₹{{ record.totalAfterTax }}
                </td>
                <td class="p-3">
                  <div class="flex justify-center gap-4">
                    <button
                      type="button" class="text-blue-400 hover:scale-110 transition-transform"
                      @click="editRow(index, setValues)"
                    >
                      <Icon icon="tabler:edit" size="20" />
                    </button>
                    <button
                      type="button" class="text-red-400 hover:scale-110 transition-transform"
                      @click="deleteRow(index)"
                    >
                      <Icon icon="tabler:trash" size="20" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="records.length" class="w-full flex justify-end">
          <div class="overflow-hidden w-3/4 rounded-2xl border border-white/10 bg-[#141414]">
            <table class="w-full text-left">
              <thead class="bg-red-400 text-white shadow-lg uppercase text-xs">
                <th class="p-3 text-right">
                  Gross Total
                </th>
                <th class="p-3 text-right">
                  Extra
                </th>
                <th class="p-3 text-right">
                  IGST Total (18%)
                </th>
                <th class="p-3 text-right">
                  CGST Total (9%)
                </th>
                <th class="p-3 text-right">
                  SGST Total (9%)
                </th>
                <th class="p-3 text-right">
                  Total Tax
                </th>
                <th class="p-3 text-right">
                  Grand Total
                </th>
              </thead>
              <tbody class="bg-white text-gray-600 text-sm font-semibold">
                <tr>
                  <td class="p-3 text-right">
                    ₹{{ grossTotal }}
                  </td>
                  <td class="p-3 text-right">
                    ₹{{ extrasTotal }}
                  </td>
                  <td class="p-3 text-right">
                    ₹{{ igstTotal }}
                  </td>
                  <td class="p-3 text-right">
                    ₹{{ cgstTotal }}
                  </td>
                  <td class="p-3 text-right">
                    ₹{{ sgstTotal }}
                  </td>
                  <td class="p-3 text-right">
                    ₹{{ totalTaxTotal }}
                  </td>
                  <td class="p-3 text-right font-bold text-green-600">
                    ₹{{ grandTotal }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>
