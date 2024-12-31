export function ExampleUsage() {
    return (
      <div>
        <ThemeSwitcher />
        <ThemedComponent className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          This content will automatically swap palettes!
        </ThemedComponent>
      </div>
    );
  }