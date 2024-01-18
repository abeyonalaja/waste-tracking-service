{{/*
Expand the name of the chart.
*/}}
{{- define "annex-vii-bulk.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "annex-vii-bulk.fullname" -}}
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
{{- define "annex-vii-bulk.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "annex-vii-bulk.labels" -}}
helm.sh/chart: {{ include "annex-vii-bulk.chart" . }}
{{ include "annex-vii-bulk.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "annex-vii-bulk.selectorLabels" -}}
app.kubernetes.io/name: {{ include "annex-vii-bulk.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "annex-vii-bulk.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "annex-vii-bulk.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the secret to use
*/}}
{{- define "annex-vii-bulk.secretName" -}}
{{- default (include "annex-vii-bulk.fullname" .) .Values.secret.name }}
{{- end }}

{{/*
Create the environment variables to use
*/}}
{{- define "annex-vii-bulk.env"}}
{{- $secretName := default (include "annex-vii-bulk.secretName" .) }}
{{- range $name, $value := .Values.secret.env }}
- name: {{ $name }}
  valueFrom:
    secretKeyRef:
      name: {{ $secretName }}
      key: {{ $name }}
{{- end }}
{{- end }}