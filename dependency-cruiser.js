module.exports = {
   forbidden: [
      {
         name: 'no-presentation-to-infrastructure',
         comment: 'presentation layer must not directly depend on infrastructure layer',
         from: { path: '^src/presentation' },
         to: { path: '^src/infrastructure' },
      },
      {
         name: 'no-presentation-to-domain',
         comment: 'presentation layer must not directly depend on domain layer',
         from: { path: '^src/presentation' },
         to: { path: '^src/domain' },
      },
      {
         name: 'no-application-to-presentation',
         comment: 'application layer must not depend on presentation layer',
         from: { path: '^src/application' },
         to: { path: '^src/presentation' },
      },
      {
         name: 'no-application-to-infrastructure',
         comment: 'application layer must not directly depend on infrastructure layer',
         from: { path: '^src/application' },
         to: { path: '^src/infrastructure' },
      },
      {
         name: 'no-domain-to-any',
         comment: 'domain layer must not depend on any other layer',
         from: { path: '^src/domain' },
         to: { path: '^(src/(application|infrastructure|presentation))' },
      },
   ],
   options: {
      doNotFollow: { path: 'node_modules' },
      exclude: 'node_modules',
   },
};
