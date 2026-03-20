package logx

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"
)

type Field struct {
	Key   string
	Value any
}

func F(key string, value any) Field {
	return Field{Key: strings.TrimSpace(key), Value: value}
}

func Info(component string, action string, fields ...Field) {
	write("INFO", component, action, nil, fields...)
}

func Warn(component string, action string, fields ...Field) {
	write("WARN", component, action, nil, fields...)
}

func Error(component string, action string, err error, fields ...Field) {
	write("ERROR", component, action, err, fields...)
}

func write(level string, component string, action string, err error, fields ...Field) {
	parts := []string{
		"level=" + formatValue(level),
		"component=" + formatValue(component),
		"action=" + formatValue(action),
	}
	if err != nil {
		parts = append(parts, "error="+formatValue(err.Error()))
	}
	for _, field := range fields {
		key := strings.TrimSpace(field.Key)
		if key == "" {
			continue
		}
		parts = append(parts, key+"="+formatValue(field.Value))
	}
	log.Print(strings.Join(parts, " "))
}

func formatValue(value any) string {
	switch item := value.(type) {
	case nil:
		return `""`
	case string:
		return quoteText(item)
	case *string:
		if item == nil {
			return `""`
		}
		return quoteText(*item)
	case error:
		if item == nil {
			return `""`
		}
		return quoteText(item.Error())
	case time.Time:
		return quoteText(item.UTC().Format(time.RFC3339Nano))
	case *time.Time:
		if item == nil {
			return `""`
		}
		return quoteText(item.UTC().Format(time.RFC3339Nano))
	case fmt.Stringer:
		return quoteText(item.String())
	default:
		return quoteText(fmt.Sprint(value))
	}
}

func quoteText(value string) string {
	text := strings.TrimSpace(value)
	text = strings.ReplaceAll(text, "\n", "\\n")
	text = strings.ReplaceAll(text, "\r", "\\r")
	return strconv.Quote(text)
}
