-- Run this in your Supabase SQL Editor to swap Stripe columns for Razorpay columns

-- First, drop the old Stripe columns
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS stripe_customer_id,
  DROP COLUMN IF EXISTS stripe_subscription_id;

-- Second, add the new Razorpay columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS razorpay_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT;

-- Third, we ensure subscription_status and subscription_tier still exist. 
-- We don't need to drop them, just note that Razorpay uses different string statuses 
-- (e.g. 'created', 'authenticated', 'active', 'pending', 'halted', 'cancelled', 'completed', 'expired')
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_status TEXT,
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE;
