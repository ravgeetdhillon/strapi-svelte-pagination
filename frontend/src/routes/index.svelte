<script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import * as qs from 'qs';

	let stateLoading = true;
	let stateArticles = null;
	let stateMeta = null;
	let stateCurrentPageNumber = 1;
	let stateCurrentPageSize = 20;

	async function getArticles(pageNumber, pageSize) {
		const query = qs.stringify(
			{
				pagination: {
					page: pageNumber,
					pageSize: pageSize
				}
			},
			{
				encodeValuesOnly: true
			}
		);
		const res = await axios.get(`http://localhost:1337/api/articles?${query}`);
		return {
			articles: res.data.data,
			meta: res.data.meta
		};
	}

	async function updateArticlesByPage(pageNumber) {
		stateLoading = true;
		stateCurrentPageNumber = pageNumber;
		const { articles, meta } = await getArticles(stateCurrentPageNumber, stateCurrentPageSize);
		stateArticles = articles;
		stateMeta = meta;
		stateLoading = false;
	}

	onMount(async () => {
		await updateArticlesByPage(stateCurrentPageNumber);
	});
</script>

<section>
	<div class="container">
		{#if stateLoading}
			<p>Loading...</p>
		{:else}
			<div>
				<h1>Strapi Articles ({stateMeta.pagination.total})</h1>

				<div class="controls">
					<div>
						<label for="inputPageSize">Page Size</label>
						<input
							name="inputPageSize"
							type="number"
							bind:value={stateCurrentPageSize}
							min="1"
							max={stateMeta.pagination.total}
						/>
						<button
							on:click|preventDefault={() => updateArticlesByPage(stateCurrentPageNumber)}
							disabled={stateMeta.pagination.total === stateCurrentPageSize}>Apply</button
						>
					</div>
				</div>

				<div class="mb-4">
					{#each stateArticles as article}
						<div class="mb-4">
							<h2 class="h4">{article.id} - {article.attributes.title}</h2>
							<p class="mb-1">{article.attributes.description}</p>
						</div>
					{/each}
				</div>

				<div class="controls">
					<button
						on:click|preventDefault={() => updateArticlesByPage(--stateCurrentPageNumber)}
						disabled={stateMeta.pagination.page === 1}>Previous</button
					>
					<div class="pagination">
						{#each { length: stateMeta.pagination.pageCount } as _, p}
							<button
								on:click|preventDefault={() => updateArticlesByPage(p + 1)}
								disabled={stateMeta.pagination.page === p + 1}>{p + 1}</button
							>
						{/each}
					</div>
					<button
						on:click|preventDefault={() => updateArticlesByPage(++stateCurrentPageNumber)}
						disabled={stateMeta.pagination.page === stateMeta.pagination.pageCount}>Next</button
					>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	* {
		--light: #e2e2e2;
		--light-dark: #a0a0a0;
		--dark: #292929;
		--disabled: #c4c3c3;
		box-sizing: border-box;
		font-family: 'Inter';
		color: var(--dark);
	}
	section {
		max-width: 100%;
		padding-top: 1rem;
		padding-bottom: 1rem;
	}
	.container {
		max-width: 576px;
		width: 100%;
		margin: auto auto;
	}
	h1 {
		font-size: 2rem;
		margin-top: 0;
		margin-bottom: 1.25rem;
	}
	h2 {
		font-size: 1.5rem;
		margin-top: 0;
		margin-bottom: 0.5rem;
	}
	p {
		margin-top: 0;
	}
	label {
		font-size: 0.8rem;
	}
	.mb-4 {
		margin-bottom: 2rem;
	}
	.controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 0.0625rem solid var(--light);
		border-bottom: 0.0625rem solid var(--light);
		padding-top: 1rem;
		padding-bottom: 1rem;
		margin-bottom: 2rem;
	}
	.pagination {
		display: flex;
		flex-wrap: nowrap;
		overflow: auto hidden;
		border-radius: 0.125rem;
		margin: auto 1rem;
	}
	.pagination::-webkit-scrollbar {
		height: 0;
	}
	.pagination button {
		border-radius: 0;
	}
	input {
		vertical-align: middle;
		outline: none;
		border: 0.0625rem solid var(--light);
		border-radius: 0.125rem;
		padding: 0.25rem 0.5rem;
	}
	input:focus {
		border: 0.0625rem solid var(--light-dark);
	}
	button {
		vertical-align: middle;
		cursor: pointer;
		background: var(--dark);
		outline: none;
		border: 0.0625rem solid var(--dark);
		color: #ffffff;
		border-radius: 0.125rem;
		padding: 0.25rem 0.5rem;
	}
	button:hover {
		background: #000000;
	}
	button:disabled {
		background: var(--disabled);
		border: 0.0625rem solid var(--disabled);
		cursor: not-allowed;
	}
</style>
