"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Save, X, GripVertical, EyeOff, Upload, ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "json-array" | "boolean" | "json-skills" | "json-modules" | "json-text" | "image" | "video";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}

interface ContentManagerProps {
  title: string;
  type: string;
  fields: FieldDef[];
  items: Record<string, unknown>[];
  onSave: (item: Record<string, unknown>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCreate: (item: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
}

function ImageUploadField({ field, value, onChange }: { field: FieldDef; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Ce fichier n'est pas une image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image trop volumineuse (max 5 Mo)");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur upload");
      }
      const data = await res.json();
      onChange(data.url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  return (
    <div className="sm:col-span-2">
      <label className="text-xs font-medium text-muted-foreground mb-1 block">
        {field.label}
      </label>
      <div
        className={`relative rounded-xl border-2 border-dashed transition-all ${
          dragOver
            ? "border-primary bg-primary/5"
            : value
            ? "border-border bg-card"
            : "border-muted-foreground/20 bg-muted/10 hover:border-primary/40"
        } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="p-3">
            <div className="relative group">
              <img
                src={value}
                alt="Preview"
                className="w-full max-h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 bg-white/90 text-black rounded-md text-xs font-medium hover:bg-white transition-colors">
                  <Upload className="h-3 w-3 inline mr-1" />
                  Changer
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                </label>
                <button
                  onClick={() => onChange("")}
                  className="px-3 py-1.5 bg-red-500/90 text-white rounded-md text-xs font-medium hover:bg-red-500 transition-colors"
                >
                  <X className="h-3 w-3 inline mr-1" />
                  Supprimer
                </button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 truncate">{value}</p>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {uploading ? "Upload en cours..." : "Glissez une image ici"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ou <span className="text-primary font-medium">cliquez pour parcourir</span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-2">
              JPG, PNG, WebP, GIF — max 5 Mo — ratio 16:9 recommandé
            </p>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
          </label>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function VideoUploadField({ field, value, onChange }: { field: FieldDef; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    setError("");
    if (!file.type.startsWith("video/")) {
      setError("Ce fichier n'est pas une vidéo (MP4 ou WebM)");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("Vidéo trop volumineuse (max 50 Mo)");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur upload");
      }
      const data = await res.json();
      onChange(data.url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  return (
    <div className="sm:col-span-2">
      <label className="text-xs font-medium text-muted-foreground mb-1 block">
        {field.label}
      </label>
      <div
        className={`relative rounded-xl border-2 border-dashed transition-all ${
          dragOver
            ? "border-primary bg-primary/5"
            : value
            ? "border-border bg-card"
            : "border-muted-foreground/20 bg-muted/10 hover:border-primary/40"
        } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="p-3">
            <div className="relative group">
              <video
                src={value}
                className="w-full max-h-48 rounded-lg object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 bg-white/90 text-black rounded-md text-xs font-medium hover:bg-white transition-colors">
                  <Upload className="h-3 w-3 inline mr-1" />
                  Changer
                  <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleFileSelect} />
                </label>
                <button
                  onClick={() => onChange("")}
                  className="px-3 py-1.5 bg-red-500/90 text-white rounded-md text-xs font-medium hover:bg-red-500 transition-colors"
                >
                  <X className="h-3 w-3 inline mr-1" />
                  Supprimer
                </button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 truncate">{value}</p>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3">
              <Video className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {uploading ? "Upload en cours..." : "Glissez une vidéo ici"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ou <span className="text-purple-500 font-medium">cliquez pour parcourir</span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-2">
              MP4, WebM — max 50 Mo — 1280×720 recommandé
            </p>
            <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleFileSelect} />
          </label>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function ContentManager({
  title,
  fields,
  items,
  onSave,
  onDelete,
  onCreate,
}: ContentManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newData, setNewData] = useState<Record<string, unknown>>({});

  const startEdit = (item: Record<string, unknown>) => {
    setEditingId(item.id as string);
    setEditData({ ...item });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSave = async () => {
    await onSave(editData);
    setEditingId(null);
    setEditData({});
  };

  const startCreate = () => {
    const defaults: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (f.type === "number") defaults[f.key] = 0;
      else if (f.type === "boolean") defaults[f.key] = false;
      else if (
        f.type === "json-array" ||
        f.type === "json-skills" ||
        f.type === "json-modules" ||
        f.type === "json-text"
      )
        defaults[f.key] = "[]";
      else defaults[f.key] = "";
    });
    defaults.visible = true;
    defaults.sortOrder = items.length;
    setNewData(defaults);
    setIsCreating(true);
    setEditingId(null);
  };

  const handleCreate = async () => {
    await onCreate(newData);
    setIsCreating(false);
    setNewData({});
  };

  const renderField = (
    field: FieldDef,
    data: Record<string, unknown>,
    setData: (d: Record<string, unknown>) => void
  ) => {
    const value = data[field.key];

    if (field.type === "boolean") {
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => setData({ ...data, [field.key]: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">{field.label}</span>
        </label>
      );
    }

    if (field.type === "select" && field.options) {
      return (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            {field.label}
          </label>
          <select
            value={(value as string) || ""}
            onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            {field.label}
          </label>
          <textarea
            value={(value as string) || ""}
            onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
            placeholder={field.placeholder}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y min-h-[60px]"
          />
        </div>
      );
    }

    if (field.type === "json-array") {
      let arr: string[] = [];
      try {
        arr = typeof value === "string" ? JSON.parse(value) : (value as string[]) || [];
      } catch { arr = []; }
      return (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            {field.label}
          </label>
          <textarea
            value={arr.join("\n")}
            onChange={(e) => {
              const lines = e.target.value.split("\n");
              setData({ ...data, [field.key]: JSON.stringify(lines.filter(Boolean)) });
            }}
            placeholder="Un élément par ligne"
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y min-h-[80px]"
          />
          <p className="text-[10px] text-muted-foreground mt-0.5">Un élément par ligne</p>
        </div>
      );
    }

    if (field.type === "image") {
      return <ImageUploadField field={field} value={value as string} onChange={(url) => setData({ ...data, [field.key]: url })} />;
    }

    if (field.type === "video") {
      return <VideoUploadField field={field} value={value as string} onChange={(url) => setData({ ...data, [field.key]: url })} />;
    }

    if (field.type === "json-modules") {
      let modules: { title: string; description?: string; duration?: string }[] = [];
      try {
        modules = typeof value === "string" ? JSON.parse(value) : (value as typeof modules) || [];
      } catch { modules = []; }
      const update = (next: typeof modules) =>
        setData({ ...data, [field.key]: JSON.stringify(next) });
      return (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            {field.label}
          </label>
          <div className="space-y-2">
            {modules.map((m, i) => (
              <div key={i} className="p-2 rounded-md border bg-muted/20 space-y-1.5">
                <div className="flex gap-2 items-start">
                  <Input
                    value={m.title}
                    placeholder="Titre du module"
                    onChange={(e) => {
                      const next = [...modules];
                      next[i] = { ...next[i], title: e.target.value };
                      update(next);
                    }}
                    className="flex-1 h-8 text-xs"
                  />
                  <Input
                    value={m.duration || ""}
                    placeholder="Durée (ex: 3h)"
                    onChange={(e) => {
                      const next = [...modules];
                      next[i] = { ...next[i], duration: e.target.value };
                      update(next);
                    }}
                    className="w-24 h-8 text-xs"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive shrink-0"
                    onClick={() => update(modules.filter((_, j) => j !== i))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <textarea
                  value={m.description || ""}
                  placeholder="Description (optionnel)"
                  onChange={(e) => {
                    const next = [...modules];
                    next[i] = { ...next[i], description: e.target.value };
                    update(next);
                  }}
                  rows={2}
                  className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs resize-y min-h-[40px]"
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => update([...modules, { title: "", description: "", duration: "" }])}
            >
              <Plus className="h-3 w-3 mr-1" /> Ajouter un module
            </Button>
          </div>
        </div>
      );
    }

    if (field.type === "json-text") {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value ?? "", null, 2);
      return (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            {field.label}
          </label>
          <textarea
            value={stringValue}
            onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
            placeholder={field.placeholder || '[]'}
            rows={6}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono resize-y min-h-[120px]"
          />
          <p className="text-[10px] text-muted-foreground mt-0.5">Format JSON brut (avancé)</p>
        </div>
      );
    }

    if (field.type === "json-skills") {
      let skills: { name: string; level: number; label: string }[] = [];
      try {
        skills = typeof value === "string" ? JSON.parse(value) : (value as typeof skills) || [];
      } catch { skills = []; }
      return (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            {field.label}
          </label>
          <div className="space-y-2">
            {skills.map((skill, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input
                  value={skill.name}
                  onChange={(e) => {
                    const updated = [...skills];
                    updated[i] = { ...updated[i], name: e.target.value };
                    setData({ ...data, [field.key]: JSON.stringify(updated) });
                  }}
                  placeholder="Compétence"
                  className="flex-1 h-8 text-xs"
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={skill.level}
                  onChange={(e) => {
                    const updated = [...skills];
                    updated[i] = { ...updated[i], level: parseInt(e.target.value) || 0 };
                    setData({ ...data, [field.key]: JSON.stringify(updated) });
                  }}
                  className="w-16 h-8 text-xs"
                />
                <select
                  value={skill.label}
                  onChange={(e) => {
                    const updated = [...skills];
                    updated[i] = { ...updated[i], label: e.target.value };
                    setData({ ...data, [field.key]: JSON.stringify(updated) });
                  }}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                >
                  <option value="Expert">Expert</option>
                  <option value="Avancé">Avancé</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Débutant">Débutant</option>
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive shrink-0"
                  onClick={() => {
                    const updated = skills.filter((_, j) => j !== i);
                    setData({ ...data, [field.key]: JSON.stringify(updated) });
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                const updated = [...skills, { name: "", level: 80, label: "Avancé" }];
                setData({ ...data, [field.key]: JSON.stringify(updated) });
              }}
            >
              <Plus className="h-3 w-3 mr-1" /> Ajouter
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">
          {field.label}
        </label>
        <Input
          type={field.type === "number" ? "number" : "text"}
          value={(value as string | number) ?? ""}
          onChange={(e) =>
            setData({
              ...data,
              [field.key]: field.type === "number" ? parseInt(e.target.value) || 0 : e.target.value,
            })
          }
          placeholder={field.placeholder}
          className="h-8 text-sm"
        />
      </div>
    );
  };

  const renderForm = (
    data: Record<string, unknown>,
    setData: (d: Record<string, unknown>) => void,
    onSubmit: () => void,
    onCancel: () => void,
    submitLabel: string
  ) => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((field) => (
              <div
                key={field.key}
                className={
                  field.type === "textarea" ||
                  field.type === "json-array" ||
                  field.type === "json-skills" ||
                  field.type === "json-modules" ||
                  field.type === "json-text" ||
                  field.type === "image" ||
                  field.type === "video"
                    ? "sm:col-span-2"
                    : ""
                }
              >
                {renderField(field, data, setData)}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-3.5 w-3.5 mr-1" /> Annuler
            </Button>
            <Button size="sm" onClick={onSubmit}>
              <Save className="h-3.5 w-3.5 mr-1" /> {submitLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{items.length} élément(s)</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={startCreate}>
          <Plus className="h-3.5 w-3.5" /> Ajouter
        </Button>
      </div>

      <AnimatePresence>
        {isCreating &&
          renderForm(newData, setNewData, handleCreate, () => setIsCreating(false), "Créer")}
      </AnimatePresence>

      <div className="space-y-2 mt-3">
        {items.map((item) => (
          <div key={item.id as string}>
            {editingId === item.id ? (
              <AnimatePresence>
                {renderForm(editData, setEditData, handleSave, cancelEdit, "Sauvegarder")}
              </AnimatePresence>
            ) : (
              <motion.div
                layout
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors group"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {(item.name || item.title || item.category || item.id) as string}
                    </span>
                    {item.status != null && (
                      <Badge variant="outline" className="text-[10px]">
                        {String(item.status)}
                      </Badge>
                    )}
                    {item.visible === false && (
                      <Badge variant="secondary" className="text-[10px] gap-0.5">
                        <EyeOff className="h-2.5 w-2.5" /> Masqué
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {(item.description || item.company || item.content || item.period || "") as string}
                  </p>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => startEdit(item)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => onDelete(item.id as string)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && !isCreating && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Aucun élément. Cliquez sur &quot;Ajouter&quot; pour commencer.
        </div>
      )}
    </div>
  );
}
