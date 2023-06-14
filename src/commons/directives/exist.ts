import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';

export function existDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName = 'exist',
): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const existDirective = getDirective(schema, fieldConfig, directiveName);
      if (existDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (...args) {
          const result = await resolve.apply(this, args);

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          console.log(fieldConfig.name);
          return result !== null;
        };
        return fieldConfig;
      }
    },
  });
}
