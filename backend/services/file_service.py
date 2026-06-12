import os
from fastapi import UploadFile


async def scan_file(file: UploadFile):

    filename = file.filename.lower()

    reasons = []
    confidence = 0
    risk_level = "SAFE"

    dangerous_extensions = [
        ".exe",
        ".bat",
        ".cmd",
        ".scr",
        ".ps1",
        ".vbs",
        ".dll",
        ".msi"
    ]

    script_extensions = [
        ".js",
        ".py",
        ".sh"
    ]

    # Dangerous executable
    if any(
        filename.endswith(ext)
        for ext in dangerous_extensions
    ):
        reasons.append(
            "Executable file detected"
        )
        confidence += 50

    # Script file
    if any(
        filename.endswith(ext)
        for ext in script_extensions
    ):
        reasons.append(
            "Script file detected"
        )
        confidence += 20

    # Double extension
    parts = filename.split(".")

    if len(parts) >= 3:
        reasons.append(
            "Multiple file extensions detected"
        )
        confidence += 30

    # Determine risk level
    if confidence < 30:
        risk_level = "SAFE"
    elif confidence < 60:
        risk_level = "MEDIUM"
    elif confidence < 85:
        risk_level = "HIGH"
    else:
        risk_level = "CRITICAL"

    if not reasons:
        reasons.append(
            "No major malware indicators detected"
        )

    return {
        "filename": file.filename,
        "risk_level": risk_level,
        "confidence": confidence,
        "reasons": reasons
    }