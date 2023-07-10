import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import InfoText from "../InfoText.vue";

describe("InfoText", () => {
    it("renders properly", () => {
        const wrapper = mount(InfoText, { props: { msg: "Hello Vitest" } });
        expect(wrapper.text()).toContain("antiSMASH database");
    });
});
