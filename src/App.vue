<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import IconStats from "./components/icons/IconStats.vue";
import IconQuery from "./components/icons/IconQuery.vue";
import IconSearch from "./components/icons/IconSearch.vue";
import IconBrowse from "./components/icons/IconBrowse.vue";
import IconAbout from "./components/icons/IconAbout.vue";
import IconHelp from "./components/icons/IconHelp.vue";
import IconReceipt from "./components/icons/IconReceipt.vue";
</script>

<template>
    <header>
        <nav class="navbar">
            <div class="nav-title">
                <RouterLink to="/">
                    <img
                        alt="antiSMASH database logo"
                        class="logo"
                        src="@/assets/logo.svg"
                        height="30"
                    />
                    <span class="title-text">antiSMASH database</span>
                </RouterLink>
            </div>

            <ul class="nav">
                <li>
                    <RouterLink to="/stats"><IconStats /> Statistics</RouterLink>
                </li>
                <li>
                    <RouterLink to="/query"><IconQuery /> Query</RouterLink>
                </li>
                <li>
                    <RouterLink to="/search"><IconSearch /> Search</RouterLink>
                </li>
                <li>
                    <RouterLink to="/browse"><IconBrowse /> Browse</RouterLink>
                </li>
                <li>
                    <RouterLink to="/jobs"><IconReceipt /> Jobs</RouterLink>
                </li>
                <li>
                    <RouterLink to="/about"><IconAbout /> About</RouterLink>
                </li>
                <li>
                    <RouterLink to="/help"><IconHelp /> Help</RouterLink>
                </li>
            </ul>
        </nav>
    </header>

    <RouterView />

    <footer class="footer">
        <div class="container">
            <div class="asdb-logo">
                <img src="/src/assets/logo.svg" />
            </div>
            <div class="cite-me">
                If you have found the antiSMASH database useful, please
                <RouterLink to="/about">cite us</RouterLink>.
            </div>
            <div class="org-logos">
                <img src="/src/assets/dtu_logo.svg" height="80px" />
            </div>
            <div class="org-logos">
                <img src="/src/assets/cfb_logo.svg" height="80px" />
            </div>
        </div>
    </footer>
</template>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--as-c-lightgray);
    background-image: linear-gradient(to bottom, #5e5e5e 0, #444 100%);
    background-repeat: repeat-x;
    border-bottom: 4px solid var(--color-brand);
    height: 50px;
}
.nav-title {
    margin-left: 1em;
}
.nav-title a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--as-c-lightgray);
}
.title-text {
    font-weight: bold;
    margin-left: 1em;
    color: var(--as-c-white-mute);
}
.nav {
    padding-left: 0;
    list-style: none;
    margin-left: auto;
    margin-right: 1em;

    display: flex;
    justify-content: flex-end;
}
.nav li {
    margin-left: 2em;
}
.nav li a {
    text-decoration: none;
    color: var(--as-c-lightgray);
}
footer .container {
    display: flex;
    align-items: center;
}
.asdb-logo {
    flex-grow: 1;
}
.asdb-logo img {
    min-height: 100px;
    max-height: 100px;
}
.cite-me {
    flex-grow: 3;
    padding: 19px;
    background-image: linear-gradient(
        to bottom,
        var(--color-background-soft),
        0,
        var(--color-background-mute) 100%
    );
    background-repeat: repeat-x;
    border: 1px solid var(--color-background-mute);
    border-radius: 4px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1);
}
.org-logos {
    flex-grow: 1;
    padding-left: 15px;
    padding-right: 15px;
}
.org-logos img {
    min-height: 80px;
    max-height: 80px;
}
</style>
