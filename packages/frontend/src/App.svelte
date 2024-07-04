<script>

  function onClick() {
    fetch(import.meta.env.VITE_APP_API_URL, {
      method: "POST",
    })
      .then((response) => response.text())
      .then((data) => {
        count = data;
    });
  }
</script>

<div class="App">
  <div>
    <p> See Iot Graph </p>
    <button on:click={onClick}>Click Me!</button>
  </div>
</div>


<style>
  .App {
    height: 100vh;
    display: grid;
    text-align: center;
    place-items: center;
  }
  p {
    margin-top: 0;
    font-size: 20px;
  }
  button {
    font-size: 48px;
  }
</style>
