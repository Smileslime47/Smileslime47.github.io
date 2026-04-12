## 编码规则

- 默认只用 `apply_patch` 修改源码文件；如果 `apply_patch` 失败，不要直接退回 `Set-Content` / `Out-File`
- 在 Windows PowerShell 下，禁止对任何包含中文或可能包含非 ASCII 的源码文件使用 `Set-Content` / `Out-File` 直接回写
- 如果确实必须用 PowerShell 写文件，只能使用 `[System.IO.File]::WriteAllText(path, content, [System.Text.UTF8Encoding]::new($false))`
- 任何非 `apply_patch` 的源码写回后，必须立刻重新读取文件校验：确认中文未乱码、没有 `�`、没有异常 BOM、副作用 diff 符合预期；未校验前不得继续下一步
- 如果修复编码需要整体重写文件，先说明原因，再用显式 UTF-8 无 BOM 写回，并再次重读校验
