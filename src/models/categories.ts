export class CategoryFilterChoices {
    labels: string[];
    choices: Map<string, number>;

    constructor(choices: object) {
        this.labels = [];
        this.choices = new Map(Object.entries(choices));

        for (const choice in choices) {
            this.labels.push(choice);
        }
    }
}

export class CategoryFilter {
    label: string;
    type: string;
    value: string;
    choices: CategoryFilterChoices;

    constructor(label: string, type: string, value: string, choices?: object) {
        this.label = label;
        this.type = type;
        this.value = value;
        this.choices = new CategoryFilterChoices(choices ?? {});
    }
}

function filterFromJson(data: any) {
    return new CategoryFilter(data.label, data.type, data.value, data.choices);
}

export class CategoryOption {
    label: string;
    value: string;
    type: string;
    countable: boolean;
    description: string;
    filters: Array<CategoryFilter>;

    constructor(
        label: string,
        value: string,
        type: string,
        countable: boolean,
        description: string,
        filters?: Array<CategoryFilter>
    ) {
        this.label = label;
        this.value = value;
        this.type = type;
        this.countable = countable;
        this.description = description;
        this.filters = filters ?? [];
    }
}

function optionFromJson(data: any) {
    const filters: Array<CategoryFilter> = [];
    data.filters?.forEach((filter: any) => {
        filters.push(filterFromJson(filter));
    });
    return new CategoryOption(
        data.label,
        data.value,
        data.type,
        data.countable,
        data.description,
        filters
    );
}

export class CategoryGroup {
    header: string;
    options: Array<CategoryOption>;

    constructor(header: string, options: Array<CategoryOption>) {
        this.header = header;
        this.options = options;
    }
}

function groupFromJson(data: any) {
    const options: Array<CategoryOption> = [];
    data.options?.forEach((option: any) => {
        options.push(optionFromJson(option));
    });

    return new CategoryGroup(data.header, options);
}

export class Categories {
    options: Array<CategoryOption>;
    groups: Array<CategoryGroup>;
    type_mapping: Map<string, string>;
    available_filters: Map<string, CategoryFilter[]>;

    constructor(options?: Array<CategoryOption>, groups?: Array<CategoryGroup>) {
        this.options = options ?? [];
        this.groups = groups ?? [];
        this.type_mapping = new Map();
        this.available_filters = new Map();
    }

    hasData() {
        return this.options.length > 0 && this.groups.length > 0;
    }

    loadFromJson(data: any) {
        this.options.length = 0;
        data.options?.forEach((option: any) => {
            this.options.push(optionFromJson(option));
        });

        this.groups.length = 0;
        data.groups?.forEach((group: any) => {
            this.groups.push(groupFromJson(group));
        });
        this.updateMappings();
    }

    updateMappings() {
        this.options.forEach((option) => {
            this.type_mapping.set(option.value, option.type);
            this.available_filters.set(option.value, option.filters);
        });

        this.groups.forEach((group) => {
            group.options.forEach((option) => {
                this.type_mapping.set(option.value, option.type);
                this.available_filters.set(option.value, option.filters);
            });
        });
    }

    getType(name: string) {
        return this.type_mapping.get(name) ?? "unset";
    }

    getFilters(name: string) {
        return this.available_filters.get(name) ?? [];
    }
}
