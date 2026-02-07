import { Calendar02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface DateTimePickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    error?: string;
    minDate?: string;
}

export function DateTimePicker({
    value,
    onChange,
    label = 'Date & Time',
    error,
    minDate,
}: DateTimePickerProps) {
    // Get minimum datetime (now + 1 hour by default)
    const getMinDateTime = () => {
        if (minDate) return minDate;

        const now = new Date();
        now.setHours(now.getHours() + 1);
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
                {label}
            </label>

            <div className="relative">
                <input
                    type="datetime-local"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    min={getMinDateTime()}
                    className={`input-field hide-native-icon ${error ? 'error' : ''}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none z-10">
                    <HugeiconsIcon
                        icon={Calendar02Icon}
                        size={24}
                        color="#FC76A7"
                        strokeWidth={1.5}
                    />
                </span>
            </div>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            <p className="text-xs text-gray-500">
                Choose when you'd like to meet up
            </p>
        </div>
    );
}
