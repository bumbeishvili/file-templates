<script>
  import { onMount } from "svelte";
  import { geoJson } from "./countries";
  import { Chart } from "./chart.d3";

  export let data = {
    name: "test",
    color: "red",
  };
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
      .svgHeight(600)
      .svgWidth(window.innerWidth - 30)
      .container(chartContainer)
      .geoJson(geoJson)
      .data(data)
      .render();
  });
</script>

<div class="w-full rounded-xl overflow-hidden" bind:this={chartContainer} />
