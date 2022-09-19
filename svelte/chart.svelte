<script>
	import { onMount } from 'svelte';
	import { API } from '../../shared/API';

	import { Chart } from './chart.d3';

	export let data = {
		name: 'test',
		color: 'red'
	};
	let classes = '';
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
