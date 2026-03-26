import React, { useState, useEffect, useMemo } from 'react';
import { Save, Sparkles, Palette, Smile, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePouchParts, usePouchAvatar } from '@/hooks/usePouchBuilder';
import type { PouchSelection, PouchPart } from '@/hooks/usePouchBuilder';
import { PouchAvatar } from './PouchAvatar';
import { PouchPartPicker } from './PouchPartPicker';

/* ------------------------------------------------------------------ */
/*  Tab config                                                         */
/* ------------------------------------------------------------------ */

const TABS = [
  { key: 'shape',      label: 'Shape',  Icon: Sparkles },
  { key: 'color',      label: 'Color',  Icon: Palette  },
  { key: 'expression', label: 'Face',   Icon: Smile    },
  { key: 'accessory',  label: 'Gear',   Icon: Sparkles },
  { key: 'background', label: 'BG',     Icon: Image    },
] as const;

type TabKey = typeof TABS[number]['key'];

const EMPTY_SELECTION: PouchSelection = {
  shape_id: null,
  color_id: null,
  expression_id: null,
  accessory_id: null,
  background_id: null,
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface PouchBuilderProps {
  userId: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const PouchBuilder = React.memo(function PouchBuilder({ userId }: PouchBuilderProps) {
  const { toast } = useToast();
  const { data: partsByCategory = {}, isLoading: partsLoading } = usePouchParts();
  const { selection: savedSelection, isLoading: avatarLoading, saveAvatar, isSaving } =
    usePouchAvatar(userId);

  const [localSelection, setLocalSelection] = useState<PouchSelection>(EMPTY_SELECTION);

  // Sync server data into local state on load
  useEffect(() => {
    if (savedSelection) {
      setLocalSelection(savedSelection);
    }
  }, [savedSelection]);

  /* Resolve selected part IDs → PouchPart objects for live preview */
  const resolvedParts = useMemo(() => {
    const findPart = (category: string, id: string | null): PouchPart | null => {
      if (!id) return null;
      return partsByCategory[category]?.find((p) => p.id === id) ?? null;
    };

    return {
      shape:      findPart('shape',      localSelection.shape_id),
      color:      findPart('color',      localSelection.color_id),
      expression: findPart('expression', localSelection.expression_id),
      accessory:  findPart('accessory',  localSelection.accessory_id),
      background: findPart('background', localSelection.background_id),
    };
  }, [localSelection, partsByCategory]);

  /* Update a single category in local selection */
  const handleSelect = (category: TabKey, id: string) => {
    setLocalSelection((prev) => ({ ...prev, [`${category}_id`]: id }));
  };

  const handleSave = async () => {
    try {
      await saveAvatar(localSelection);
      toast({ title: 'Pouch saved!', description: 'Your pouch avatar has been updated.' });
    } catch {
      toast({
        title: 'Save failed',
        description: 'Could not save your pouch. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isLoading = partsLoading || avatarLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
        Loading builder…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Live preview */}
      <div className="flex justify-center">
        <div className="border border-border rounded-xl p-4 bg-muted/20 flex items-center justify-center">
          <PouchAvatar
            shape={resolvedParts.shape}
            color={resolvedParts.color}
            expression={resolvedParts.expression}
            accessory={resolvedParts.accessory}
            background={resolvedParts.background}
            size={120}
          />
        </div>
      </div>

      {/* Part picker tabs */}
      <Tabs defaultValue="shape">
        <TabsList className="grid grid-cols-5 w-full">
          {TABS.map(({ key, label, Icon }) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-1">
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map(({ key }) => (
          <TabsContent key={key} value={key} className="mt-3">
            <PouchPartPicker
              parts={partsByCategory[key] ?? []}
              selectedId={localSelection[`${key}_id`]}
              onSelect={(id) => handleSelect(key, id)}
              category={key}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full gap-2"
      >
        <Save className="w-4 h-4" aria-hidden="true" />
        {isSaving ? 'Saving…' : 'Save My Pouch'}
      </Button>
    </div>
  );
});
