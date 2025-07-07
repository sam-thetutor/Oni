# Payment Link Creation Logic Test

## Updated Behavior

The `create_payment_links` tool now automatically determines whether to create a fixed or global payment link based on whether an amount is specified:

### Test Cases

1. **Create Global Payment Link (No Amount)**
   - User says: "Create a payment link"
   - User says: "Make a payment link for donations"
   - User says: "I need a link to collect money"
   - **Result**: Creates a global payment link automatically

2. **Create Fixed Payment Link (With Amount)**
   - User says: "Create a payment link for 0.5 XFI"
   - User says: "Make a payment link for exactly 1 XFI"
   - User says: "I need a link for 0.1 XFI"
   - **Result**: Creates a fixed payment link for the specified amount

## Tool Schema Changes

```typescript
// OLD Schema
schema = z.object({
  amount: z.string().describe("The amount for the payment link in XFI (e.g., '0.1')")
})

// NEW Schema  
schema = z.object({
  amount: z.string().optional().describe("Optional: The amount for a fixed payment link in XFI (e.g., '0.1'). If not provided, creates a global payment link.")
})
```

## Implementation Logic

```typescript
const isGlobal = !amount || amount.trim() === '';

if (isGlobal) {
  // Create global payment link
  // Uses createGlobalPaymentLinkOnChain()
  // URL: /global-paylink/${linkID}
} else {
  // Create fixed payment link
  // Uses createPaymentLinkOnChain(amount)
  // URL: /paylink/${linkID}
}
```

## API Response Changes

Both types now return a `type` field:
- `"type": "global"` for global payment links
- `"type": "fixed"` for fixed payment links

## Frontend Integration

The wallet page will now show both types with proper filtering and display:
- Global links show total contributions
- Fixed links show the set amount
- Proper URLs for each type 