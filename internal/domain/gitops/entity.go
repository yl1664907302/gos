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
