{{/*
Expand the name of the chart.
*/}}
{{- define "service-reference-data.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "service-reference-data.fullname" -}}
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
{{- define "service-reference-data.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "service-reference-data.labels" -}}
helm.sh/chart: {{ include "service-reference-data.chart" . }}
{{ include "service-reference-data.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "service-reference-data.selectorLabels" -}}
app.kubernetes.io/name: {{ include "service-reference-data.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "service-reference-data.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "service-reference-data.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create the name of the secret to use
*/}}
{{- define "service-reference-data.secretName" -}}
{{- default (include "service-reference-data.fullname" .) .Values.secret.name }}
{{- end }}

{{/*
Create the environment variables to use
*/}}
{{- define "service-reference-data.env"}}
{{- $secretName := default (include "service-reference-data.secretName" .) }}
{{- range $name, $value := .Values.secret.env }}
- name: {{ $name }}
  valueFrom:
    secretKeyRef:
      name: {{ $secretName }}
      key: {{ $name }}
{{- end }}
{{- end }}

{{/*
Define minAvailable replicas for PDB to enforce
*/}}
{{- define "service-reference-data.pdbMinAvailable" -}}
{{- if not .Values.autoscaling.enabled }}
{{- default .Values.replicaCount }}
{{- else }}
{{- default .Values.autoscaling.minReplicas }}
{{- end }}
{{- end }}