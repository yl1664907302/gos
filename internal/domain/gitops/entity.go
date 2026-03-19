package gitops

// FieldCandidate 描述 GitOps 仓库中可被平台替换的一个 YAML 标量字段。
//
// 当前模型故意不直接暴露“任意 YAML 编辑器”，而是先把字段扫描结果
// 结构化成文件、文档、路径三级信息，便于前端做受控选择。
type FieldCandidate struct {
	FilePathTemplate string
	DocumentKind     string
	DocumentName     string
	TargetPath       string
	ValueType        string
	SampleValue      string
	DisplayName      string
}

// ValuesCandidate 描述 Helm values 文件中一个可被平台写回的标量字段。
//
// Helm 场景下平台不再围绕渲染后的 Kubernetes YAML 做规则配置，
// 而是直接面向 values 文件与 values 键路径建模。
type ValuesCandidate struct {
	FilePathTemplate string
	TargetPath       string
	ValueType        string
	SampleValue      string
	DisplayName      string
}

// ManifestRule 描述一次 GitOps 写回时要应用到 YAML 的具体替换动作。
//
// ValueTemplate 由上层根据发布单参数渲染完成后再传入，这样 GitOps 服务只负责
// “按既定路径写值”，不负责理解业务字段含义。
type ManifestRule struct {
	FilePath     string
	DocumentKind string
	DocumentName string
	TargetPath   string
	Value        string
}

// ValuesRule 描述一次 GitOps 写回时要应用到 Helm values 文件上的具体动作。
type ValuesRule struct {
	FilePath   string
	TargetPath string
	Value      string
}
