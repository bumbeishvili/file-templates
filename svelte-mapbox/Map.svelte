<script>
  import { onMount } from "svelte";

  import { Chart } from "./mapbox.d3";

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
      .data(data)
      .render();
  });
</script>

<div style="height:calc(100vh - 150px)" class='rounded-xl' bind:this={chartContainer} />
