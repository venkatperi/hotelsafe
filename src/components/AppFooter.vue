<template>
  <footer class="mastfoot mt-auto">
    <div class="copyright">
      Copyright &copy; 2018 Venkat Peri.  All Rights Reserved.
    </div>
    <div class="versions">
      __MODULE_VERSIONS__
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'app-footer',
  }
</script>

<style lang="scss" scoped>
  .copyright, .versions {
    margin-top: 1rem;
    font-family: "Share Tech Mono", sans-serif;
    text-transform: uppercase;
    font-size: 0.5rem;
    color: #555;
  }

  .mastfoot {
    text-align: center;
  }
</style>
