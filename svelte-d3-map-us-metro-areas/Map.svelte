<script>
  import { onMount } from "svelte";
  import { metro } from "./metro";
  import { Chart } from "./usmap.d3";

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
      console.log("data change");
    }
  }

  onMount(() => {
    chart = new Chart(data)
      .svgHeight(600)
      .svgWidth(window.innerWidth - 30)
      .container(chartContainer)
      .geoJson(states)
      .metro(metro)
      .data(data)
      .render();
  });
</script>

<div class="w-full rounded-xl overflow-hidden" bind:this={chartContainer} />
