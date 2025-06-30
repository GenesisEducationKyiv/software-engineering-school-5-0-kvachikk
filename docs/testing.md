```
npm test            # runs unit -> api e2e -> ui e2e
```

green check marks will be shown at each stage, if you do not see them, then the tests have failed

---

## run tests separately

### unit tests
```
npm run test:unit
```

### api e2e tests
```
npm run test:e2e
```

### ui e2e tests (playwright)
```
npm install
```
```
npx playwright install --with-deps
``` 
```
npm run test:ui
```

---

## ci pipelines
* github actions already has three jobs:
    * `unit-tests` – jest unit tests
    * `e2e-api-tests` – jest api tests
    * `ui-tests` – playwright ui tests

all jobs run automatically on every push and pull request.
