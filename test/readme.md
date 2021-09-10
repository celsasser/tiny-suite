# End to End Tests

These tests are designed to:
* test the machine from end to end.
* offer _how to_ examples

So here we go...

## Run

1. Make sure the suite is built
2. From the project root run `jest test/eto.test.ts` or run `yarn run test:ete`

## Details

This is a suite designed to be used at a command line. Output is piped as standard input
into other commands. Hence, to test we are using child processes to `execute` to test.
All test output should go to files. It makes testing easier being that we don't want to 
deal with reading`stdout` in these tests. At least not quite yet.