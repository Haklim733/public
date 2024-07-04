<script>
  import svelteLogo from './assets/svelte.svg'
  async function callApiLambda() {
    console.log(import.meta.VITE_API_URL);
    try {
      const response = await fetch(`${import.meta.VITE_API_URL}/iot/simulate`, {
        method: 'POST', // or 'GET', depending on your Lambda setup
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as required by your API
        },
        body: JSON.stringify({
          // Your request body here, if needed
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data); // Process your response data here
    } catch (error) {
      console.error("Failed to call API Lambda:", error);
    }
  }
</script>

<main>
  <div>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>
  <h3> {import.meta.env.VITE_API_URL} </h3>
  <button on:click={callApiLambda}>Invoke API Lambda</button>

</main>



<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
</style>
