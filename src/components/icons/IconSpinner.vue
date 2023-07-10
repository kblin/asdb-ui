<template>
    <svg
        class="__loading"
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        width="1em"
        fill="currentColor"
    >
        <use xlink:href="/src/assets/icons.svg#spinner"></use>
    </svg>
</template>

<style scoped>
.__loading {
    animation: spinner 1s linear infinite;
}

@keyframes spinner {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
