export const ScheduleSwaggerSchema = {
    components: {
        schemas: {
            ScheduleBreakTime: {
                type: "object",
                properties: {
                    startHour: {
                        type: "number",
                        description: "Start hour of the break",
                    },
                    endHour: {
                        type: "number",
                        description: "End hour of the break",
                    },
                    startMinute: {
                        type: "number",
                        description: "Start minute of the break",
                    },
                    endMinute: {
                        type: "number",
                        description: "End minute of the break",
                    },
                },
            },
            ScheduleDay: {
                type: "object",
                properties: {
                    startHour: {
                        type: "number",
                        description: "Start hour of the day",
                        nullable: true,
                    },
                    endHour: {
                        type: "number",
                        description: "End hour of the day",
                        nullable: true,
                    },
                    startMinute: {
                        type: "number",
                        description: "Start minute of the day",
                        nullable: true,
                    },
                    endMinute: {
                        type: "number",
                        description: "End minute of the day",
                        nullable: true,
                    },
                    dayName: {
                        type: "string",
                        description: "Name of the day",
                    },
                    isDayOff: {
                        type: "boolean",
                        description: "Is this day a day off",
                    },
                    index: {
                        type: "number",
                        description: "Index of the day in the week",
                    },
                    breakTime: {
                        $ref: "#/components/schemas/ScheduleBreakTime",
                        nullable: true,
                    },
                },
                required: ["dayName", "isDayOff", "index"],
            },
            Schedule: {
                type: "object",
                properties: {
                    days: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/ScheduleDay",
                        },
                        description: "Array of schedules days",
                    },
                },
                required: ["days"],
            },
        },
    },
};
