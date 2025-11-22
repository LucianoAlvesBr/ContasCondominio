-- Migration script to add new columns to existing expenses table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS is_planned boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_risk_item boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS risk_type text,
ADD COLUMN IF NOT EXISTS deadline date;

-- Update existing records to have default values
UPDATE public.expenses 
SET is_planned = false, 
    is_risk_item = false
WHERE is_planned IS NULL OR is_risk_item IS NULL;
