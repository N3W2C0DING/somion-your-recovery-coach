import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export type JournalValues = {
  soreness: number;
  energy: number;
  motivation: number;
  notes: string;
};

const DEFAULT_VALUES: JournalValues = {
  soreness: 3,
  energy: 7,
  motivation: 7,
  notes: "",
};

const todayIso = () => new Date().toISOString().slice(0, 10);

export function useJournalEntry() {
  const { user } = useAuth();
  const [values, setValues] = useState<JournalValues>(DEFAULT_VALUES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [hasEntry, setHasEntry] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setValues(DEFAULT_VALUES);
      setHasEntry(false);
      setSavedAt(null);
      return;
    }

    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("soreness, energy, motivation, notes, updated_at")
        .eq("user_id", user.id)
        .eq("entry_date", todayIso())
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        setLoading(false);
        return;
      }

      if (data) {
        setValues({
          soreness: data.soreness ?? DEFAULT_VALUES.soreness,
          energy: data.energy ?? DEFAULT_VALUES.energy,
          motivation: data.motivation ?? DEFAULT_VALUES.motivation,
          notes: data.notes ?? "",
        });
        setSavedAt(data.updated_at ?? null);
        setHasEntry(true);
      } else {
        setValues(DEFAULT_VALUES);
        setSavedAt(null);
        setHasEntry(false);
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const updateValue = useCallback(<K extends keyof JournalValues>(key: K, value: JournalValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  }, []);

  const save = useCallback(async () => {
    if (!user) {
      toast.error("Please sign in first");
      return false;
    }

    setSaving(true);

    const payload = {
      user_id: user.id,
      entry_date: todayIso(),
      soreness: values.soreness,
      energy: values.energy,
      motivation: values.motivation,
      notes: values.notes.trim() || null,
    };

    const { data, error } = await supabase
      .from("journal_entries")
      .upsert(payload, { onConflict: "user_id,entry_date" })
      .select("updated_at")
      .single();

    setSaving(false);

    if (error) {
      toast.error(error.message ?? "Could not save check-in");
      return false;
    }

    setHasEntry(true);
    setSavedAt(data.updated_at ?? new Date().toISOString());
    toast.success("Morning check-in saved");
    return true;
  }, [user, values]);

  const journal = useMemo(
    () => ({
      soreness: values.soreness,
      energy: values.energy,
      motivation: values.motivation,
    }),
    [values],
  );

  return {
    values,
    journal,
    loading,
    saving,
    hasEntry,
    savedAt,
    updateValue,
    save,
  };
}
