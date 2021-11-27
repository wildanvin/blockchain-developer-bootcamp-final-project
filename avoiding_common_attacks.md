# Contract security measures

## SWC-103 (Floating pragma)

Specific compiler pragma `0.8.10` used in contracts to avoid accidental bug inclusion through outdated compiler versions.

## SWC-104 (Unchecked Call Return Value)

The return value from a call to the players address in `calculateWinner` is checked with `require` to ensure transaction rollback if call fails.
