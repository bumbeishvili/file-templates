<script>
  import { onMount } from "svelte";

  import { Chart } from "./Treemap.d3";

  export let data = [
    {
      name: "Software Developer/Engineer",
      value: 39484,
    },
    {
      name: "Customer Service Representative",
      value: 31086,
    },
    {
      name: "Sales Representative",
      value: 24954,
    },
    {
      name: "Retail Store Manager / Supervisor",
      value: 23043,
    },
  ];
  let classes = "";
  export { classes as class };

  let chart;
  let chartContainer;

  $: {
    if (chart) {
      chart.data(data).render();
    }
  }

  onMount(() => {
    chart = new Chart(data)
      .svgHeight(400)
      .svgWidth(window.innerWidth - 30)
      .container(chartContainer)
      .data(data)
      .render();
  });
</script>

<div bind:this={chartContainer} />
