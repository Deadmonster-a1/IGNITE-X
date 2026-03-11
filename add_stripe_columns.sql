-- Migration: Add Stripe subscription columns to profiles table
-- Run this in your Supabase SQL editor

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT, -- e.g., 'active', 'canceled', 'past_due'
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free', -- e.g., 'free', 'pro', 'architect'
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE;
