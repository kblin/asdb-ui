<script setup lang="ts">
import IconAdd from "../icons/IconAdd.vue";
import IconPen from "../icons/IconPen.vue";
import DialogView from "../DialogView.vue";
import IconTrash from "../icons/IconTrash.vue";

import { QueryModuleTerm, ModuleStep } from "@/models/queries";
import { ref } from "vue";

const model = defineModel<string>();

const emits = defineEmits<{
    done: [];
    cancel: [];
}>();

const domains = ref<QueryModuleTerm>(new QueryModuleTerm(model.value));
const editModalOpen = ref(false);

const currentAlternativeIdx = ref<number>();
const currentIdx = ref<number>();
const currentStep = ref<ModuleStep>();

function loadExample() {
    domains.value.steps[0].alternatives = [["PKS_KS"]];
    domains.value.steps[1].alternatives = [["none"]];
    domains.value.steps[2].alternatives = [["PKS_KR"], ["PKS_ER"], ["PKS_DH", "cMT"]];
    domains.value.steps[3].alternatives = [["any"]];
    domains.value.steps[4].alternatives = [["Thioesterase"]];
    domains.value.steps[5].alternatives = [];
}

function getClass(domain: string): string {
    if (domain.startsWith("Condensation")) {
        return "condensation";
    }

    if (domain.startsWith("PKS_DH")) {
        return "dehydratase";
    }

    switch (domain) {
        case "PKS_KS":
            return "ketosynthase";
        case "PKS_AT":
            return "acyltransferase";
        case "PKS_ER":
            return "enoylreductase";
        case "PKS_KR":
            return "ketoreductase";
        case "Cglyc":
        case "Heterocyclisation":
            return "condensation";
        case "AMP-binding":
        case "A-OX":
            return "adenylation";
        case "PCP":
        case "ACP":
        case "ACP_beta":
        case "PP-binding":
        case "PKS_PP":
            return "transport";
        case "TD":
        case "Thioesterase":
            return "terminal";
        case "Epimerase":
            return "epimerase";
        default:
            return "";
    }
}

function addCombination(stepIdx: number, alternativeIdx: number) {
    const group = domains.value.steps[stepIdx].alternatives[alternativeIdx];
    group.push("");
    editDomain(stepIdx, alternativeIdx, group.length - 1);
}

function addAlternative(stepIdx: number) {
    let newGroup = [""];
    const steps = domains.value.steps[stepIdx].alternatives;
    steps.push(newGroup);
    editDomain(stepIdx, steps.length - 1, 0);
}

function editDomain(stepIdx: number, alternativeIdx: number, idx: number) {
    currentStep.value = domains.value.steps[stepIdx];
    currentAlternativeIdx.value = alternativeIdx;
    currentIdx.value = idx;
    editModalOpen.value = true;
}

function deleteDomain(stepIdx: number, alternativeIdx: number, idx: number) {
    domains.value.steps[stepIdx].removeDomain(alternativeIdx, idx);
}

function clearQuery() {
    domains.value.steps.forEach((step) => (step.alternatives = []));
}

function done() {
    if (!model) {
        return;
    }
    model.value = domains.value.toString();
    emits("done");
}
</script>

<template>
    <div class="instructions">
        <h3>Instructions</h3>
        <div class="grid">
            <div>
                Special characters/operators<br />
                <strong>none</strong>: no domain is allowed<br />
                <strong>any</strong>: a single domain must exist, but it can be anything<br />
                <strong>ignored</strong>: the section is not considered when searching<br /><br />
                For descriptions and sources of these domains, see the
                <a
                    href="https://docs.antismash.secondarymetabolites.org/modules/nrps_pks_domains/"
                    target="_blank"
                    >glossary</a
                >.
            </div>
        </div>
    </div>
    <div class="grid search-domains">
        <div v-for="(step, stepIdx) in domains.steps" :key="step.title" class="drop-target">
            <h4>
                {{ step.title }}
            </h4>
            <ul class="alternatives">
                <div v-if="step.alternatives.length == 0">ignored</div>
                <li v-for="(group, alternativeIdx) in step.alternatives" :key="alternativeIdx">
                    <div>
                        <ul class="combinations">
                            <li v-for="(domain, idx) in group" :key="idx">
                                <div v-if="idx == 0" class="operator"></div>
                                <div v-else class="operator">and</div>

                                <div class="domain" :class="getClass(domain)">
                                    {{ domain }}
                                    <span>
                                        <span
                                            class="icon"
                                            @click="editDomain(stepIdx, alternativeIdx, idx)"
                                        >
                                            <IconPen
                                        /></span>
                                        <span
                                            class="icon"
                                            @click="deleteDomain(stepIdx, alternativeIdx, idx)"
                                        >
                                            <IconTrash
                                        /></span>
                                    </span>
                                </div>

                                <div
                                    v-if="idx + 1 == group.length"
                                    class="add"
                                    @click="addCombination(stepIdx, alternativeIdx)"
                                >
                                    <IconAdd />
                                </div>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
            <div class="add-domain" @click="addAlternative(stepIdx)">
                <IconAdd /> Add alternative
            </div>
        </div>
    </div>
    <div class="grid search-buttons">
        <button @click="emits('cancel')">Cancel</button>
        <button @click="done" class="btn-primary">Done</button>
        <button @click="clearQuery">Clear query</button>
        <button @click="loadExample">Load example</button>
    </div>
    <DialogView :open="editModalOpen">
        <div>
            <strong>{{ currentStep?.title }}</strong>
        </div>
        <div
            class="dialog-container"
            v-if="
                currentStep !== undefined &&
                currentAlternativeIdx !== undefined &&
                currentIdx !== undefined
            "
        >
            <select
                v-model="currentStep.alternatives[currentAlternativeIdx][currentIdx]"
                @change="editModalOpen = false"
            >
                <option label="Please select a domain" value="" />
                <optgroup label="wildcard">
                    <option label="any" value="any" />
                    <option label="none" value="none" />
                </optgroup>
                <optgroup label="specific">
                    <option
                        v-for="option in currentStep.options"
                        :key="option"
                        :label="option"
                        :value="option"
                    />
                </optgroup>
            </select>
        </div>
        <div class="confirm_buttons">
            <button @click="editModalOpen = false" class="btn-primary">Done</button>
        </div>
    </DialogView>
</template>

<style scoped>
.instructions .grid {
    --grid-gap: 3rem;
    --grid-min-width: 25ch;
}

.search-domains {
    padding-top: 2rem;
    --grid-gap: 0;
}
.drop-target {
    border: 1px solid var(--color-border);
    display: grid;
    place-content: start center;
}
.search-buttons {
    --grid-gap: 4rem;
    padding-top: 2rem;
}

.search-buttons > .btn-primary {
    grid-column: span 2;
}

.alternatives {
    list-style: none;
    padding: 0;
}

.combinations > li {
    display: grid;
    grid-template-columns: 3em auto 2em;
    grid-template-areas: "operator domain add";
}

.combinations > li .operator {
    grid-area: operator;
}

.combinations > li .domain {
    grid-area: domain;
}

.combinations > li .add-domain {
    grid-area: add;
}

.alternatives > li:not(:first-child)::before {
    content: "or";
}
.combinations {
    list-style: none;
    padding: 0;
}
.add {
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
    opacity: 30%;
}

.add:hover {
    transition: opacity 0.5s ease-in;
    opacity: 100%;
}

.add-domain {
    padding-inline: 0.5rem;
    color: var(--color-text);
    background-color: var(--color-background-mute);
    cursor: pointer;
    border-radius: 0.5rem;
    border: 1px dashed var(--color-border);
}
.drop-target .add-domain {
    opacity: 20%;
    transition: opacity 0.25s ease-in-out;
}

.drop-target:hover .add-domain {
    opacity: 66%;
    transition: opacity 0.25s ease-in-out;
}
.drop-target:hover .add-domain:hover {
    opacity: 100%;
    transition: opacity 0.25s ease-in-out;
}

.domain {
    display: flex;
    color: var(--color-heading);
    justify-content: space-between;
    border-radius: 1rem;
    padding-inline: 1rem;
    border: 1px solid var(--color-border);
    text-align: center;
    background-color: var(--color-background-mute);
}

.domain .icon {
    padding-left: 0.5em;
    opacity: 20%;
    transition: opacity 0.25s ease-in-out;
    cursor: pointer;
}
.drop-target:hover .domain .icon {
    transition: opacity 0.25s ease-in-out;
    opacity: 50%;
}

.domain:hover .icon:hover {
    transition: opacity 0.25s ease-in-out;
    opacity: 90%;
}
.dialog-container {
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.5rem;
}
.dialog-spacer {
    padding-inline: 0.5em;
}
.condensation,
.epimerase {
    color: white;
    border-color: #3b3b8c;
    background-color: #8181f7;
}

.adenylation {
    color: black;
    border-color: #571680;
    background-color: #bc7ff5;
}

.ketosynthase,
.ketoreductase {
    color: black;
    border-color: #09b309;
    background-color: #81f781;
}
.acyltransferase {
    color: black;
    border-color: #dd0606;
    background-color: #f78181;
}
.dehydratase {
    color: black;
    border-color: #ba670f;
    background-color: #f7be81;
}
.enoylreductase {
    color: black;
    border-color: #0ca189;
    background-color: #81f7f7;
}
.transport {
    color: black;
    border-color: #0b4ec7;
    background-color: #81bef7;
}
.terminal {
    color: black;
    border-color: #770377;
    background-color: #f5c4f2;
}
</style>
