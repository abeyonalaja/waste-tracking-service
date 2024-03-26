{{/*
Expand the name of the chart.
*/}}
{{- define "service-limited-audience.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "service-limited-audience.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "service-limited-audience.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "service-limited-audience.labels" -}}
helm.sh/chart: {{ include "service-limited-audience.chart" . }}
{{ include "service-limited-audience.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "service-limited-audience.selectorLabels" -}}
app.kubernetes.io/name: {{ include "service-limited-audience.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "service-limited-audience.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "service-limited-audience.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the secret to use
*/}}
{{- define "service-limited-audience.secretName" -}}
{{- default (include "service-limited-audience.fullname" .) .Values.secret.name }}
{{- end }}

{{/*
Create the environment variables to use
*/}}
{{- define "service-limited-audience.env"}}
{{- $secretName := default (include "service-limited-audience.secretName" .) }}
{{- range $name, $value := .Values.secret.env }}
- name: {{ $name }}
  valueFrom:
    secretKeyRef:
      name: {{ $secretName }}
      key: {{ $name }}
{{- end }}
{{- end }}