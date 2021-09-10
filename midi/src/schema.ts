import * as joi from 'joi';

/***********************
 * Types
 **********************/
export type TestFunction = (fdatasync: any) => boolean;

export const numericArraySchema = joi.array().items(joi.number()).min(1);
export const monophonicArraySchema = numericArraySchema;
export const polyphonicArraySchema = joi
	.array()
	.items(joi.number(), numericArraySchema)
	.min(1);
export const channelObjectSchema = joi.object({
	durations: monophonicArraySchema.optional(),
	notes: polyphonicArraySchema.required(),
	velocities: monophonicArraySchema.optional(),
});
export const channelArraySchema = joi.array().items(channelObjectSchema).min(1);

/***********************
 * Schema tests
 **********************/
export const isMonophonicArray: TestFunction = isValid(monophonicArraySchema);
export const isPolyphonicArray: TestFunction = isValid(polyphonicArraySchema);
export const isChannelArray: TestFunction = isValid(channelArraySchema);

/***********************
 * Private Interface
 **********************/
function isValid(schema: joi.AnySchema): TestFunction {
	return (data: any): boolean => {
		const { error } = schema.validate(data);
		return error === undefined;
	};
}
