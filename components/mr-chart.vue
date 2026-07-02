<script setup lang="ts">
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { onMounted, onUnmounted, ref, watch } from "vue";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
);

const { data, pending, error } = await useFetch("/api/mrgraphs");
const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;
const activeFilter = ref<"grossTotal" | "netTotal" | "gstTotal">("grossTotal");

function renderChart() {
  if (!canvasRef.value || !data.value?.success || !data.value?.data)
    return;

  const rawData = data.value.data;

  // Sort data by year and month
  const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const sortedData = [...rawData].sort((a, b) => {
    if (a.year !== b.year)
      return a.year - b.year;
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });

  const labels = sortedData.map(d => `${d.month.substring(0, 3)} ${d.year}`);

  let salesData: number[] = [];
  let purchaseData: number[] = [];
  let filterLabel = "";

  if (activeFilter.value === "grossTotal") {
    salesData = sortedData.map(d => d.salesGrossTotal);
    purchaseData = sortedData.map(d => d.purchaseGrossTotal);
    filterLabel = "Gross Total";
  }
  else if (activeFilter.value === "netTotal") {
    salesData = sortedData.map(d => d.salesNetTotal);
    purchaseData = sortedData.map(d => d.purchaseNetTotal);
    filterLabel = "Net Total";
  }
  else if (activeFilter.value === "gstTotal") {
    salesData = sortedData.map(d => d.salesGstTotal);
    purchaseData = sortedData.map(d => d.purchaseGstTotal);
    filterLabel = "GST Total";
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(canvasRef.value, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: `Sales (${filterLabel})`,
          data: salesData,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: `Purchase (${filterLabel})`,
          data: purchaseData,
          backgroundColor: "rgba(255, 99, 132, 0.7)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: `Monthly Sales vs Purchases (${filterLabel})`,
          font: {
            size: 16,
            family: "'Inter', sans-serif",
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 20,
          },
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          titleColor: "#1f2937",
          bodyColor: "#4b5563",
          borderColor: "#e5e7eb",
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          usePointStyle: true,
        },
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: "'Inter', sans-serif",
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#f3f4f6",
          },
          border: {
            dash: [4, 4],
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

onMounted(() => {
  renderChart();
});

watch([data, activeFilter], () => {
  renderChart();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
</script>

<template>
  <div class="card bg-base-100 shadow-sm border border-base-200">
    <div class="card-body p-4 sm:p-6">
      <!-- Filter controls -->
      <div class="flex flex-wrap items-center justify-between mb-4 gap-4">
        <h3 class="font-bold text-lg text-base-content/80">
          Monthly Overview
        </h3>
        <div class="join">
          <button
            class="btn btn-sm join-item"
            :class="activeFilter === 'grossTotal' ? 'btn-primary' : 'btn-outline border-base-300'"
            @click="activeFilter = 'grossTotal'"
          >
            Gross Total
          </button>
          <button
            class="btn btn-sm join-item"
            :class="activeFilter === 'netTotal' ? 'btn-primary' : 'btn-outline border-base-300'"
            @click="activeFilter = 'netTotal'"
          >
            Net Total
          </button>
          <button
            class="btn btn-sm join-item"
            :class="activeFilter === 'gstTotal' ? 'btn-primary' : 'btn-outline border-base-300'"
            @click="activeFilter = 'gstTotal'"
          >
            GST Total
          </button>
        </div>
      </div>

      <div v-if="pending" class="flex justify-center items-center h-80">
        <span class="loading loading-spinner text-primary" />
      </div>
      <div v-else-if="error" class="text-error flex justify-center items-center h-80">
        Error loading data: {{ error.message }}
      </div>
      <div
        v-else-if="!data?.data || data.data.length === 0"
        class="flex flex-col justify-center items-center h-80 text-base-content/50"
      >
        <Icon name="solar:chart-square-linear" size="48" class="mb-2 opacity-50" />
        <p>No registers available to display.</p>
      </div>
      <div v-else class="relative h-80 w-full">
        <canvas ref="canvasRef" />
      </div>
    </div>
  </div>
</template>
